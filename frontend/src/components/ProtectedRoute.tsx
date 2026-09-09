import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserAppRole } from '../context/AuthContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  allowedRole?: UserAppRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg-sidebar)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    // Super Admin has universal access
    if (role === 'admin') {
      return <Outlet />;
    }

    // Company user trying to access Super Admin route (/admin) -> Strictly redirect to /company/dashboard
    if (allowedRole === 'admin' && role !== 'admin') {
      return <Navigate to="/company/dashboard" replace />;
    }

    // Direct role mismatch
    if (role !== allowedRole) {
      return <Navigate to={`/${role}/dashboard`} replace />;
    }
  }

  return <Outlet />;
};
