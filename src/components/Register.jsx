import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaGlobe, FaLock, FaEye, FaEyeSlash, FaTimes, FaUserPlus } from 'react-icons/fa';

export default function Signup() {
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    mobileNumber: '',
    password: '',
    countryCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
    
    if (!agreeToTerms) {
      toast.error('Please agree to the terms and privacy policy');
      return;
    }
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modern Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <FaUserPlus className="text-white text-xl" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Join Inno-IDE and start creating</p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <FaTimes size={16} />
          </button>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                placeholder="Full Name"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Country Code Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGlobe className="text-gray-400" />
              </div>
              <input
                type="text"
                name="countryCode"
                value={data.countryCode}
                onChange={onChangeHandler}
                placeholder="Country Code (e.g. +91)"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Mobile Number Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="text"
                name="mobileNumber"
                value={data.mobileNumber}
                onChange={onChangeHandler}
                placeholder="Mobile Number"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={onChangeHandler}
                placeholder="Password"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                By continuing, I agree to the{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
