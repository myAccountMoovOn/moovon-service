import React from 'react';
import { RocketFilled } from '@ant-design/icons';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import FeatureGrid from '../../components/home/FeatureGrid';
import LaptopPreview from '../../components/home/LaptopPreview';
import TrustIndicators from '../../components/home/TrustIndicators';
import SignupCard from '../../components/auth/SignupCard';
import BillJiFooter from '../../components/layout/BillJiFooter';

export const BillJiSignupPage: React.FC = () => {
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
      {/* Top Header Navbar (Reused from Home/Login) */}
      <BillJiNavbar />

      {/* Main Two-Column Hero Content Area */}
      <main style={{ flex: 1 }}>
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '44px 24px 64px 24px',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '48px',
            alignItems: 'flex-start',
          }}
          className="signup-main-container"
        >
          {/* Left Column: Product & Marketing Presentation */}
          <div style={{ minWidth: 0 }}>
            {/* Top Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#155EEF',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                boxShadow: '0 1px 2px rgba(21, 94, 239, 0.05)',
              }}
            >
              <RocketFilled style={{ fontSize: '13px', color: '#155EEF' }} />
              <span>Join 10,000+ businesses growing with BillJi</span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#0B1B3A',
                lineHeight: 1.1,
                letterSpacing: '-1.2px',
                margin: '0 0 16px 0',
              }}
              className="signup-heading"
            >
              Create Your Account<br />
              and Get Started<br />
              with <span style={{ color: '#155EEF' }}>BillJi</span>
            </h1>

            {/* Sub-heading / Description Paragraph */}
            <p
              style={{
                fontSize: '17px',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 0 28px 0',
                maxWidth: '560px',
              }}
            >
              Set up your account in minutes and manage your business, customers, invoices, team and more — all in one powerful platform.
            </p>

            {/* 6 Feature Grid Blocks */}
            <FeatureGrid />

            {/* Laptop / Dashboard Preview Mockup */}
            <LaptopPreview />

            {/* 3 Trust Indicators */}
            <TrustIndicators />
          </div>

          {/* Right Column: White Signup Card */}
          <div
            style={{
              position: 'sticky',
              top: '96px',
              display: 'flex',
              justifyContent: 'center',
            }}
            className="signup-card-column"
          >
            <SignupCard />
          </div>
        </div>
      </main>

      {/* Dark Navy Footer (Reused from Home/Login) */}
      <BillJiFooter />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .signup-main-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .signup-heading {
            font-size: 38px !important;
          }
          .signup-card-column {
            position: relative !important;
            top: 0 !important;
            order: 2;
          }
        }

        @media (max-width: 640px) {
          .signup-heading {
            font-size: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillJiSignupPage;
