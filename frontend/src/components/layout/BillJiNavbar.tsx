import React, { useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { GlobalOutlined, DownOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiLogo from '../common/BillJiLogo';

interface BillJiNavbarProps {
  onLoginClick?: () => void;
  hideLogin?: boolean;
  hideSignUp?: boolean;
}

export const BillJiNavbar: React.FC<BillJiNavbarProps> = ({ onLoginClick, hideLogin, hideSignUp }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown items
  const productsMenu: MenuProps['items'] = [
    { key: '1', label: 'CRM & Customer Management' },
    { key: '2', label: 'Sales & Invoicing System' },
    { key: '3', label: 'HR & Payroll Automation' },
    { key: '4', label: 'Projects & Task Management' },
    { key: '5', label: 'Support Desk & Ticketing' },
    { key: '6', label: 'Reports & Smart Analytics' },
  ];

  const solutionsMenu: MenuProps['items'] = [
    { key: '1', label: 'For Small Businesses' },
    { key: '2', label: 'For Agencies & Resellers' },
    { key: '3', label: 'For Enterprises & Franchises' },
  ];

  const resourcesMenu: MenuProps['items'] = [
    { key: '1', label: 'Blog & Articles' },
    { key: '2', label: 'Help Center & Guides' },
    { key: '3', label: 'API Documentation' },
  ];

  const companyMenu: MenuProps['items'] = [
    { key: '1', label: 'About Us' },
    { key: '2', label: 'Contact Us' },
    { key: '3', label: 'Partners Program' },
  ];

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      const loginCardElement = document.getElementById('login-card-section');
      if (loginCardElement) {
        loginCardElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/login');
      }
    }
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#334155',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E4EAF2',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: BillJi Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <BillJiLogo size="medium" />
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="hidden-mobile"
        >
          <Dropdown menu={{ items: productsMenu }} trigger={['hover']}>
            <span style={navLinkStyle}>
              Products <DownOutlined style={{ fontSize: '10px', color: '#94A3B8' }} />
            </span>
          </Dropdown>

          <Dropdown menu={{ items: solutionsMenu }} trigger={['hover']}>
            <span style={navLinkStyle}>
              Solutions <DownOutlined style={{ fontSize: '10px', color: '#94A3B8' }} />
            </span>
          </Dropdown>

          <span style={navLinkStyle}>
            Features
          </span>

          <span style={navLinkStyle}>
            Pricing
          </span>

          <Dropdown menu={{ items: resourcesMenu }} trigger={['hover']}>
            <span style={navLinkStyle}>
              Resources <DownOutlined style={{ fontSize: '10px', color: '#94A3B8' }} />
            </span>
          </Dropdown>

          <Dropdown menu={{ items: companyMenu }} trigger={['hover']}>
            <span style={navLinkStyle}>
              Company <DownOutlined style={{ fontSize: '10px', color: '#94A3B8' }} />
            </span>
          </Dropdown>

          <Button
            type="default"
            style={{
              borderColor: '#E4EAF2',
              color: 'white',
              backgroundColor:'green',
              fontWeight: 500,
              borderRadius: '6px',
            }}
            onClick={() => {
              const isLocal = window.location.hostname.includes('localhost');
              const domain = isLocal ? 'localhost:5173' : 'billji.com';
              window.location.href = `${window.location.protocol}//reseller.${domain}`;
            }}
          >
            Reseller
          </Button>

          <Button
            type="default"
            style={{
              borderColor: '#E4EAF2',
              color: 'white',
              backgroundColor:"blue",
              fontWeight: 500,
              borderRadius: '6px',
            }}
            onClick={() => {
              const isLocal = window.location.hostname.includes('localhost');
              const domain = isLocal ? 'localhost:5173' : 'billji.com';
              window.location.href = `${window.location.protocol}//company.${domain}`;
            }}
          >
            Company
          </Button>
        </nav>

        {/* Right Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Language Selector */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <GlobalOutlined style={{ fontSize: '15px', color: '#64748B' }} />
            <span>EN</span>
          </div>

          {/* Auth Button — single Login / Register */}
          {!hideLogin && (
            <Button
              type="primary"
              onClick={handleLoginClick}
              style={{
                backgroundColor: '#155EEF',
                borderColor: '#155EEF',
                height: '42px',
                padding: '0 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: '0 2px 6px rgba(21, 94, 239, 0.25)',
              }}
            >
              Login / Register
            </Button>
          )}

          {/* Mobile Menu Toggle Button (Strictly hidden on desktop/large screens) */}
          <div
            className="nav-mobile-toggle"
            style={{ cursor: 'pointer', fontSize: '20px', marginLeft: '8px' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E4EAF2',
            padding: '20px 24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 999,
          }}
        >
          <span style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Products & Features
          </span>
          <span style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </span>
          <span style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Company & About
          </span>
          <span style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </span>
          <div style={{ height: '1px', backgroundColor: '#E4EAF2', margin: '8px 0' }} />
          <Button
            type="primary"
            block
            onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
            style={{ backgroundColor: '#155EEF', height: '44px', borderRadius: '8px', fontWeight: 600 }}
          >
            Start Free Trial
          </Button>
        </div>
      )}

      {/* Responsive Navbar Styles: Burger Icon hidden on large screens */}
      <style>{`
        .nav-mobile-toggle {
          display: none !important;
        }
        @media (max-width: 868px) {
          .hidden-mobile {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default BillJiNavbar;
