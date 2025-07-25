// import { Navigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const isLoggedIn = localStorage.getItem('user');

//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

export default function ProtectedRoute({ children }) {
  const { token } = useContext(StoreContext);
  return token ? children : <Navigate to="/login" replace />;
}
