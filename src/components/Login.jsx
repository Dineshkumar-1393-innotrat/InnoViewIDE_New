// import { useNavigate } from 'react-router-dom';
// export default function Login() {
//   const navigate = useNavigate();
//   const handleLogin = () => {
//     localStorage.setItem('user', 'demo');
//     navigate('/e');
//   };
//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
//       <button onClick={handleLogin} className="bg-blue-600 px-6 py-2 rounded">Login</button>
//     </div>
//   );
// // }
// import { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { StoreContext } from '../context/StoreContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { assets } from '../assets/assets'; // your icons
// import './LoginPopup.css';

// export default function Login() {
//   const { url, token, setToken } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const [currState, setCurrState] = useState("Sign Up");
//   const [data, setData] = useState({ name: '', mobileNumber
//     : '', password: '' ,countryCode:''});

//   useEffect(() => {
//     if (token) navigate('/e');
//   }, [token]);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = currState === "Login" ? "https://eureka.innotrat.in/api/v1/auth/signin" : "https://eureka.innotrat.in/api/v1/auth/signup";

//     try {
//       const response = await axios.post(`${url}${endpoint}`, data);
//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         toast.success(`${currState} successful!`);
//         navigate('/e');
//       } else {
//         toast.error(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       toast.error("Server error. Please try again.");
//     }
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onSubmit} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>{currState}</h2>
//           <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
//         </div>
//         <div className="login-popup-inputs">
//           {currState !== "Login" && (
//             <input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Your Name" required />
//           )}
//           <input type="mobileNumber" name="mobileNumber" value={data.mobileNumber} onChange={onChangeHandler} placeholder="Your mobileNumber" required />
//           <input type="countryCode" name="countryCode" value={data.countryCode} onChange={onChangeHandler} placeholder="Your countryCode" required />

//           <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="Your Password" required />
//         </div>
//         <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>
//         <div className="login-popup-condition">
//           <input type="checkbox" required />
//           <p>By continuing, I agree to terms & privacy policy.</p>
//         </div>
//         <p>
//           {currState === "Login" ? (
//             <>Create account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></>
//           ) : (
//             <>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// }



// import { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { StoreContext } from '../context/StoreContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { assets } from '../assets/assets';
// import './LoginPopup.css';

// export default function Login() {
//   const { setToken } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const [currState, setCurrState] = useState("Sign Up");
//   const [data, setData] = useState({
//     name: '',
//     mobileNumber: '',
//     password: '',
//     countryCode: ''
//   });

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       setToken(savedToken);
//       navigate('/e');
//     }
//   }, []);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const endpoint = currState === "Login"
//       ? "https://eureka.innotrat.in/api/v1/auth/signin"
//       : "https://eureka.innotrat.in/api/v1/auth/signup";

//     try {
//       const response = await axios.post(endpoint, data);

//       if (response.data.status === 'success') {
//         toast.success(`${currState} successful!`);

//         if (response.data.token) {
//           setToken(response.data.token);
//           localStorage.setItem("token", response.data.token);
//         }

//         navigate('/e');
//       } else {
//         toast.error(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Server error. Please try again.");
//     }
//   };

//   return (
//     <div className="login-popup">
//       <form onSubmit={onSubmit} className="login-popup-container">
//         <div className="login-popup-title">
//           <h2>{currState}</h2>
//           <img src={assets.cross_icon} alt="close" onClick={() => navigate('/')} />
//         </div>

//         <div className="login-popup-inputs">
//           {currState !== "Login" && (
//             <input
//               type="text"
//               name="name"
//               value={data.name}
//               onChange={onChangeHandler}
//               placeholder="Your Name"
//               required
//             />
//           )}
//           <input
//             type="text"
//             name="mobileNumber"
//             value={data.mobileNumber}
//             onChange={onChangeHandler}
//             placeholder="Your Mobile Number"
//             required
//           />
//           <input
//             type="text"
//             name="countryCode"
//             value={data.countryCode}
//             onChange={onChangeHandler}
//             placeholder="Country Code (e.g. +91)"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             value={data.password}
//             onChange={onChangeHandler}
//             placeholder="Your Password"
//             required
//           />
//         </div>

//         <button type="submit">
//           {currState === "Sign Up" ? "Create Account" : "Login"}
//         </button>

//         <div className="login-popup-condition">
//           <input type="checkbox" required />
//           <p>By continuing, I agree to terms & privacy policy.</p>
//         </div>

//         <p>
//           {currState === "Login" ? (
//             <>Create account? <span onClick={() => setCurrState("Sign Up")}>Sign Up</span></>
//           ) : (
//             <>Already have an account? <span onClick={() => setCurrState("Login")}>Login</span></>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// }



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
