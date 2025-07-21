// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './src/components/Login';
// import ProtectedRoute from './src/components/ProtectedRoute';
// import Layout from './src/components/Layout'; // ✅ New import
// import Layoutone from './src/components/Layoutone';
// export default function AppRouter() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={<Navigate to="/e" replace />} />
//       <Route
//         path="/e"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/el"
//         element={
//           <ProtectedRoute>
//             <Layoutone />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/e" replace />} />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './src/components/Login';
import ProtectedRoute from './src/components/ProtectedRoute';
import Layout from './src/components/Layout';
import Layoutone from './src/components/Layoutone';
import Register from './src/components/Register';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/" element={<Navigate to="/e" replace />} />
      <Route
        path="/e"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/el"
        element={
          <ProtectedRoute>
            <Layoutone />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/e" replace />} />
    </Routes>
  );
}
