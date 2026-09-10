import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AuthModal } from '../../../components/AuthModal';

export const ServicesNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <MoovonLogo width={160} height={42} showSubtitle={true} />
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link-item">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link-item">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-link-item active">
                Services
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="nav-link-item">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link-item">
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => openAuth('login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--moovon-navy)',
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--moovon-navy)',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};
