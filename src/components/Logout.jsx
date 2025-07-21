// src/components/Logout.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';

export default function Logout() {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage and context
    localStorage.removeItem('token');
    setToken(null);

    // Show toast
    toast.success('You have been logged out');

    // Redirect to login after short delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    // Cleanup timeout
    return () => clearTimeout(timer);
  }, [navigate, setToken]);

  return null; // No UI needed
}
