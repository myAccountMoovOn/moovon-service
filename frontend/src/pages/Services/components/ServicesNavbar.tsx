import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { ArrowRight, Menu, X } from 'lucide-react';

export const ServicesNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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

        {/* Desktop CTA Button */}
        <Link
          to="/contact"
          className="btn-gradient"
          style={{ height: '42px', padding: '0 22px', fontSize: '13px' }}
        >
          <span>LET'S TALK</span>
          <ArrowRight className="arrow-icon" size={16} />
        </Link>

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
  );
};
