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
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch user info", err);
        setToken(null);
        localStorage.removeItem('google_auth_token');
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setToken(codeResponse.access_token);
      localStorage.setItem('google_auth_token', codeResponse.access_token);
      navigate('/embedded');
    },
    onError: (error) => console.log('Login Failed:', error)
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
