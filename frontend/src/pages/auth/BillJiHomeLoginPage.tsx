import React from 'react';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import HeroBadge from '../../components/home/HeroBadge';
import FeatureGrid from '../../components/home/FeatureGrid';
import DashboardPreview from '../../components/home/DashboardPreview';
import TrustIndicators from '../../components/home/TrustIndicators';
import LoginCard from '../../components/auth/LoginCard';
import BillJiFooter from '../../components/layout/BillJiFooter';

export const BillJiHomeLoginPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7FAFF',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(21, 94, 239, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 40%)
        `,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Header Navbar */}
      <BillJiNavbar />

      {/* Main Two-Column Hero Content Area */}
      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '44px 24px 64px 24px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.95fr',
            gap: '48px',
            alignItems: 'flex-start',
          }}
          className="hero-main-container"
        >
          {/* Left Column (55% width): Product Presentation */}
          <div style={{ minWidth: 0 }}>
            {/* Hero Pill Badge */}
            <HeroBadge />

            {/* Main Hero Heading */}
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#0B1B3A',
                lineHeight: 1.1,
                letterSpacing: '-1.2px',
                margin: '0 0 16px 0',
              }}
              className="hero-heading"
            >
              One Platform.<br />
              <span style={{ color: '#155EEF' }}>Endless</span> Possibilities.
            </h1>

            {/* Description Paragraph */}
            <p
              style={{
                fontSize: '18px',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 0 28px 0',
                maxWidth: '560px',
              }}
            >
              Manage your business, customers, invoices, team and projects in one powerful platform. Built for businesses of all sizes.
            </p>

            {/* 6 Feature Grid Blocks */}
            <FeatureGrid />

            {/* Dashboard Preview Component with Handwritten Annotation */}
            <DashboardPreview />

            {/* 3 Trust Indicators */}
            <TrustIndicators />
          </div>

          {/* Right Column (45% width): Prominent White Login Card */}
          <div
            style={{
              position: 'sticky',
              top: '96px',
              display: 'flex',
              justifyContent: 'center',
            }}
            className="login-column"
          >
            <LoginCard />
          </div>
        </div>
      </main>

      {/* Dark Navy Footer */}
      <BillJiFooter />

      {/* Responsive Inline CSS Styles for Mobile/Tablet */}
      <style>{`
        @media (max-width: 1024px) {
          .hero-main-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-heading {
            font-size: 40px !important;
          }
          .login-column {
            position: relative !important;
            top: 0 !important;
            order: 2;
          }
          .hidden-tablet-mobile {
            display: none !important;
          }
          .footer-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile-only {
            display: block !important;
          }
          .hero-heading {
            font-size: 32px !important;
          }
          .feature-grid-container {
            grid-template-columns: 1fr !important;
          }
          .trust-indicators-container {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .footer-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillJiHomeLoginPage;
