import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();

  useEffect(() => {
    if (!authState.token) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You are not authenticated. Please log in to continue!',
        showConfirmButton: true,
      });
    }
  }, [authState.token]);

  if (!authState.token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;