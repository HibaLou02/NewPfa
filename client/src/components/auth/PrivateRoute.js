import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth.isAuthenticated()) {
    // Rediriger vers la page de connexion en conservant l'URL de destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les rôles si nécessaire
  if (requiredRoles.length > 0 && !requiredRoles.includes(auth.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute; 