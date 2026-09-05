import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { ArrowRight } from 'lucide-react';

export const ContactNavbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="floating-navbar-container">
      <nav className="floating-navbar">
        {/* Brand Logo */}
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <MoovonLogo width={160} height={42} showSubtitle={true} />
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/login" className={`nav-link-item ${path === '/' || path === '/login' ? 'active' : ''}`}>
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

        {/* CTA Button */}
        <Link to="/contact" className="btn-gradient" style={{ height: '42px', padding: '0 22px', fontSize: '13px' }}>
          <span>LET'S TALK</span>
          <ArrowRight className="arrow-icon" size={16} />
        </Link>
      </nav>
    </div>
  );
};
