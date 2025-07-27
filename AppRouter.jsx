
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './src/components/Login';
import ProtectedRoute from './src/components/ProtectedRoute';
import Layout from './src/components/Layout'; // for Flowchart
import Layoutone from './src/components/Layoutone'; // for Block Diagram
import Register from './src/components/Register';
import PageTransition from './src/components/PageTransition';

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<Navigate to="/e" replace />} />

        <Route
          path="/e"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layout />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/el"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Layoutone />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/e" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
