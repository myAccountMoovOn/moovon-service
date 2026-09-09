import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import {
  LinkedinFilled,
  YoutubeFilled,
  TwitterOutlined,
  FacebookFilled,
  InstagramOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiLogo from '../common/BillJiLogo';

export const BillJiFooter: React.FC = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please enter a valid email address');
      return;
    }
    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMsg('Thank you for subscribing to BillJi updates!');
      setNewsletterEmail('');
    }, 800);
  };

  const footerColumnTitleStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '16px',
  };

  const footerLinkStyle: React.CSSProperties = {
    color: '#94A3B8',
    fontSize: '13px',
    lineHeight: '2.2',
    cursor: 'pointer',
    transition: 'color 0.2s',
    display: 'block',
  };

  return (
    <footer
      style={{
        backgroundColor: '#061B33',
        color: '#94A3B8',
        paddingTop: '64px',
        paddingBottom: '32px',
        borderTop: '1px solid #1E293B',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* Main 6 Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1.1fr 1.1fr 1.1fr 1fr 1.8fr',
            gap: '32px',
            marginBottom: '48px',
          }}
          className="footer-grid-container"
        >
          {/* Column 1: BillJi Logo & Info */}
          <div>
            <BillJiLogo variant="dark" size="medium" />
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '16px', lineHeight: 1.6, maxWidth: '280px' }}>
              All-in-one business management platform for modern businesses, partners and service providers.
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '20px', fontSize: '18px' }}>
              <a href="#" style={{ color: '#CBD5E1' }}><LinkedinFilled /></a>
              <a href="#" style={{ color: '#CBD5E1' }}><YoutubeFilled /></a>
              <a href="#" style={{ color: '#CBD5E1' }}><TwitterOutlined /></a>
              <a href="#" style={{ color: '#CBD5E1' }}><FacebookFilled /></a>
              <a href="#" style={{ color: '#CBD5E1' }}><InstagramOutlined /></a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <div style={footerColumnTitleStyle}>Products</div>
            <span style={footerLinkStyle}>CRM & Customers</span>
            <span style={footerLinkStyle}>Sales & Invoicing</span>
            <span style={footerLinkStyle}>HR & Payroll</span>
            <span style={footerLinkStyle}>Projects & Tasks</span>
            <span style={footerLinkStyle}>Support Desk</span>
            <span style={footerLinkStyle}>Reports & Analytics</span>
            <span style={footerLinkStyle}>Integrations</span>
          </div>

          {/* Column 3: Company */}
          <div>
            <div style={footerColumnTitleStyle}>Company</div>
            <span style={footerLinkStyle}>About Us</span>
            <span style={footerLinkStyle}>Our Mission</span>
            <span style={footerLinkStyle}>Careers</span>
            <span style={footerLinkStyle}>Partners Program</span>
            <span style={footerLinkStyle}>News & Media</span>
            <span style={footerLinkStyle}>Contact Us</span>
          </div>

          {/* Column 4: Resources */}
          <div>
            <div style={footerColumnTitleStyle}>Resources</div>
            <span style={footerLinkStyle}>Blog</span>
            <span style={footerLinkStyle}>Help Center</span>
            <span style={footerLinkStyle}>Video Tutorials</span>
            <span style={footerLinkStyle}>Webinars</span>
            <span style={footerLinkStyle}>eBooks & Guides</span>
            <span style={footerLinkStyle}>API Documentation</span>
            <span style={footerLinkStyle}>Release Notes</span>
          </div>

          {/* Column 5: Legal */}
          <div>
            <div style={footerColumnTitleStyle}>Legal</div>
            <span style={footerLinkStyle}>Privacy Policy</span>
            <span style={footerLinkStyle}>Terms of Service</span>
            <span style={footerLinkStyle}>Refund Policy</span>
            <span style={footerLinkStyle}>Security</span>
            <span style={footerLinkStyle}>Compliance</span>
          </div>

          {/* Column 6: Newsletter */}
          <div>
            <div style={footerColumnTitleStyle}>Subscribe to our Newsletter</div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.5 }}>
              Get the latest updates, tips and resources from BillJi.
            </p>

            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#0F2744',
                    border: '1px solid #1E3A5F',
                    color: '#FFFFFF',
                    fontSize: '13px',
                  }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={newsletterStatus === 'loading'}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: '#155EEF',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: 'none',
                    padding: '0 18px',
                  }}
                >
                  Subscribe
                </Button>
              </div>

              {newsletterStatus === 'error' && (
                <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '2px' }}>{newsletterMsg}</div>
              )}
              {newsletterStatus === 'success' && (
                <div style={{ fontSize: '11px', color: '#86EFAC', marginTop: '2px' }}>{newsletterMsg}</div>
              )}
            </form>
          </div>
        </div>

        {/* Separator Line */}
        <div style={{ height: '1px', backgroundColor: '#1E293B', marginBottom: '24px' }} />

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748B',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>© 2026 BillJi. All rights reserved.</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Made with ❤️ in India</span>
            <span style={{ color: '#334155' }}>|</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <GlobalOutlined style={{ fontSize: '13px' }} />
              <span>English (EN) ▾</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BillJiFooter;
