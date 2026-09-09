import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BillJiSignupPage from './BillJiSignupPage';

const Signup: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  // If already logged in, redirect based on role
  if (!isLoading && user) {
    const redirectTarget = role === 'admin' ? '/admin/dashboard' : (role === 'company' ? '/company/dashboard' : '/customer/dashboard');
    return <Navigate to={redirectTarget} replace />;
  }

  return <BillJiSignupPage />;
};

export default Signup;
