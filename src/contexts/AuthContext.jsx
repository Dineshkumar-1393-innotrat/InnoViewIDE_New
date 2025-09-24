import React, { createContext, useState, useContext, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('google_auth_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch user info', err);
          setToken(null);
          localStorage.removeItem('google_auth_token');
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const loginWithGoogle = useGoogleLogin({
    // Ensure we request the correct scopes for userinfo
    scope: 'openid profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    prompt: 'select_account',
    onSuccess: async (codeResponse) => {
      try {
        const accessToken = codeResponse.access_token;
        if (!accessToken) throw new Error('No access token received');

        // Persist token first so refreshes still work
        setToken(accessToken);
        localStorage.setItem('google_auth_token', accessToken);

        // Fetch user profile immediately so UI can update and then navigate
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
        setUser(data);
        navigate('/embedded');
      } catch (err) {
        console.error('Google login flow failed:', err);
        // Clean up any partial state if we failed
        setToken(null);
        setUser(null);
        localStorage.removeItem('google_auth_token');
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    },
  });

  const loginWithEmail = (email) => {
    // This is a mock login. In a real app, you would validate credentials against a backend.
    const mockUser = {
      name: email.split('@')[0], // Create a name from the email
      email: email,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` // Generate a profile picture
    };
    setUser(mockUser);
    navigate('/embedded');
  };

  const logout = () => {
    googleLogout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('google_auth_token');
    navigate('/');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginWithGoogle, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
