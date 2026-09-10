import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../components/layout/BillJiNavbar';
import BillJiFooter from '../components/layout/BillJiFooter';

const ResellerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <BillJiNavbar />

      <main style={{ flex: 1 }}>
        <section
          style={{
            backgroundColor: '#F0FDF4', // Light greenish background
            backgroundImage: `
              radial-gradient(circle at 5% 10%, rgba(22, 163, 74, 0.05) 0%, transparent 45%),
              radial-gradient(circle at 95% 90%, rgba(22, 163, 74, 0.04) 0%, transparent 45%)
            `,
            padding: '80px 24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '24px',
              }}
            >
              <span>BillJi Partner Program</span>
            </div>

            <h1
              style={{
                fontSize: '54px',
                fontWeight: 800,
                color: '#064E3B',
                lineHeight: 1.1,
                letterSpacing: '-1.2px',
                margin: '0 0 24px 0',
              }}
            >
              Become a <span style={{ color: '#16A34A' }}>Reseller</span>.<br />
              Grow Your Business Together.
            </h1>

            <p
              style={{
                fontSize: '18px',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 auto 40px auto',
                maxWidth: '600px',
              }}
            >
              Partner with BillJi and offer powerful business management tools to your clients. 
              Earn recurring revenue, access exclusive resources, and scale your agency.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
              <Button
                type="primary"
                onClick={() => navigate('/signup')}
                style={{
                  backgroundColor: '#16A34A',
                  borderColor: '#16A34A',
                  height: '52px',
                  padding: '0 32px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
              >
                Join Partner Program <ArrowRightOutlined />
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', fontSize: '14px', color: '#064E3B', fontWeight: 600, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#16A34A', fontSize: '18px' }} />
                <span>High Commission Rates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#16A34A', fontSize: '18px' }} />
                <span>Dedicated Support</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#16A34A', fontSize: '18px' }} />
                <span>White-label Options</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BillJiFooter />
    </div>
  );
};

export default ResellerHome;
