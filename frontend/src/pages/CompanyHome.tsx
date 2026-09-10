import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../components/layout/BillJiNavbar';
import BillJiFooter from '../components/layout/BillJiFooter';

const CompanyHome: React.FC = () => {
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
            backgroundColor: '#F8FAFC', // Light blue/grayish white background
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(20, 104, 232, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(20, 104, 232, 0.04) 0%, transparent 50%)
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
                backgroundColor: '#EFF6FF',
                color: '#1468E8',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '24px',
              }}
            >
              <span>Enterprise Management Hub</span>
            </div>

            <h1
              style={{
                fontSize: '54px',
                fontWeight: 800,
                color: '#071A3D',
                lineHeight: 1.1,
                letterSpacing: '-1.2px',
                margin: '0 0 24px 0',
              }}
            >
              Empower Your <span style={{ color: '#1468E8' }}>Company</span>.<br />
              All Your Operations in One Place.
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
              Register your company and manage teams, projects, billing, and HR directly from your dedicated enterprise dashboard. Built for scale and efficiency.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
              <Button
                type="primary"
                onClick={() => navigate('/signup')}
                style={{
                  backgroundColor: '#1468E8',
                  borderColor: '#1468E8',
                  height: '52px',
                  padding: '0 32px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(20, 104, 232, 0.25)',
                }}
              >
                Register Company <ArrowRightOutlined />
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', fontSize: '14px', color: '#071A3D', fontWeight: 600, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#1468E8', fontSize: '18px' }} />
                <span>Advanced Analytics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#1468E8', fontSize: '18px' }} />
                <span>Unlimited Users</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleFilled style={{ color: '#1468E8', fontSize: '18px' }} />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BillJiFooter />
    </div>
  );
};

export default CompanyHome;
