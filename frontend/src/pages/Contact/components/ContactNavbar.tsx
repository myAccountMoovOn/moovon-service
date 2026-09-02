import React from 'react';
import { Link } from 'react-router-dom';
import { MoovonLogo } from '../../../assets/MoovonLogo';
import { ArrowRight } from 'lucide-react';

export const ContactNavbar: React.FC = () => {
  return (
    <div className="floating-navbar-container">
      <nav className="floating-navbar">
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <MoovonLogo width={160} height={42} showSubtitle={true} />
        </Link>

        {/* Navigation Links */}
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
            <Link to="/services" className="nav-link-item">
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link-item active">
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
