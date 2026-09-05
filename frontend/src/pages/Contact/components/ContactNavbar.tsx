import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { ArrowRight } from 'lucide-react';
import { AuthModal } from '../../../components/AuthModal';

export const ContactNavbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <div className="floating-navbar-container">
        <nav className="floating-navbar">
          {/* Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <MoovonLogo width={160} height={42} showSubtitle={true} />
          </Link>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link-item ${path === '/' || path === '/login' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link-item ${path === '/about' ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className={`nav-link-item ${path === '/services' ? 'active' : ''}`}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link-item ${path === '/contact' ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Action Buttons: Sign In / Sign Up */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => openAuth('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--navy-primary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                padding: '8px 12px',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="btn-gradient"
              style={{ height: '42px', padding: '0 22px', fontSize: '13px', border: 'none' }}
            >
              <span>SIGN UP</span>
              <ArrowRight className="arrow-icon" size={16} />
            </button>
          </div>
        </nav>
      </div>

      {/* Auth Overlay Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};
