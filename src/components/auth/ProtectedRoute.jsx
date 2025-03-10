import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../context/authStore';

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();

  // If no token, redirect to login immediately
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
} 