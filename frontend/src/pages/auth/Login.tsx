import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BillJiHomeLoginPage from './BillJiHomeLoginPage';
import LoginCard from '../../components/auth/LoginCard';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

const Login: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  // If already logged in, redirect based on role — but respect the current subdomain
  if (!isLoading && user) {
    const isResellerDomain = window.location.hostname.startsWith('reseller.');
    const isCompanyDomain = window.location.hostname.startsWith('company.');

    if (isResellerDomain || isCompanyDomain) {
      // On reseller/company subdomains, only /dashboard exists — always go there
      return <Navigate to="/dashboard" replace />;
    }

    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'reseller' || role === 'provider') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  const hostname = window.location.hostname;
  const isSubdomain = hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('www.');

  if (isSubdomain) {
    const isReseller = hostname.startsWith('reseller.');
    const bgColor = isReseller ? '#F0FDF4' : '#F8FAFC';
    
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: bgColor }}>
        <BillJiNavbar hideLogin hideSignUp />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
          <LoginCard />
        </div>
        <BillJiFooter />
      </div>
    );
  }

  return <BillJiHomeLoginPage />;
};

export default Login;
