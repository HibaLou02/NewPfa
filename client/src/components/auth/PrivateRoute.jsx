import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => authService.hasRole(role));

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute; 