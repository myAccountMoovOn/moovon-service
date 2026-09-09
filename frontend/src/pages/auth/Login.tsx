import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BillJiHomeLoginPage from './BillJiHomeLoginPage';

const Login: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  // If already logged in, redirect based on role
  if (!isLoading && user) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return <BillJiHomeLoginPage />;
};

export default Login;
