


import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import './LoginPopup.css';

export default function Signin() {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    mobileNumber: '',
    password: '',
    countryCode: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      navigate('/e');
    }
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'https://eureka.innotrat.in/api/v1/auth/signin';

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.status === 'success') {
        toast.success('Login successful!');
        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        navigate('/e');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error during signin');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
          <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
        </div>

        <div className="login-popup-inputs">
          <input
            type="text"
            name="mobileNumber"
            value={data.mobileNumber}
            onChange={onChangeHandler}
            placeholder="Your Mobile Number"
            required
          />
          <input
            type="text"
            name="countryCode"
            value={data.countryCode}
            onChange={onChangeHandler}
            placeholder="Country Code (e.g. +91)"
            required
          />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Your Password"
            required
          />
        </div>

        <button type="submit">Login</button>

        <p>
          Don’t have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}
