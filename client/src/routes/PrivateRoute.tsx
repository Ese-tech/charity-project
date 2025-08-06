import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { userInfo } = useAuth();
  
  return userInfo ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;