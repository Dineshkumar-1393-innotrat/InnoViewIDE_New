import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import './LoginPopup.css';

export default function Signup() {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
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
    const endpoint = 'https://eureka.innotrat.in/api/v1/auth/signup';

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.status === 'success') {
        toast.success('Signup successful!');
        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        navigate('/e');
      } else {
        toast.error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error during signup');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Sign Up</h2>
          <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
        </div>

        <div className="login-popup-inputs">
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Your Name"
            required
          />
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

        <button type="submit">Create Account</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to terms & privacy policy.</p>
        </div>

        <p>
          Already have an account? <span onClick={() => navigate('/signin')}>Login</span>
        </p>
      </form>
    </div>
  );
}
