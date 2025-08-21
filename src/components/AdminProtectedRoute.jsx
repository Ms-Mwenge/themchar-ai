import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/adminAuthStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
