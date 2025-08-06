import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../component/Register';
import Login from '../component/Login';
import Dashboard from '../component/Dashboard';
import { useAuth } from '../AuthContext'; // Import useAuth

// A simple PrivateRoute component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      {/* Redirect root to login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;