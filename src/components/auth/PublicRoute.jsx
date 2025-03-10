import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../context/authStore';

export default function PublicRoute({ children }) {
  const { token } = useAuthStore();

  // If already authenticated, redirect to notes
  if (token) {
    return <Navigate to="/notes" replace />;
  }

  return children;
} 