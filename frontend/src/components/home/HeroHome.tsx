import React from 'react';
import { Button } from 'antd';
import {
  StarFilled,
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  BankOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiLogo from '../common/BillJiLogo';

export const HeroHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      style={{
        backgroundColor: '#F4F8FF',
        backgroundImage: `
          radial-gradient(circle at 5% 10%, rgba(20, 104, 232, 0.05) 0%, transparent 45%),
          radial-gradient(circle at 95% 90%, rgba(124, 58, 237, 0.04) 0%, transparent 45%)
        `,
        padding: '64px 24px 72px 24px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.35fr',
          gap: '48px',
          alignItems: 'center',
        }}
        className="home-hero-container"
      >
        {/* Left Column: Headline & CTAs */}
        <div style={{ minWidth: 0 }}>
          {/* Small Pill Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              color: '#1468E8',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              boxShadow: '0 1px 2px rgba(20, 104, 232, 0.05)',
            }}
          >
            <StarFilled style={{ fontSize: '13px', color: '#1468E8' }} />
            <span>All-in-One Business Management Platform</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: '54px',
              fontWeight: 800,
              color: '#071A3D',
              lineHeight: 1.1,
              letterSpacing: '-1.2px',
              margin: '0 0 18px 0',
            }}
            className="home-hero-heading"
          >
            Run Your Business.<br />
            Grow <span style={{ color: '#1468E8' }}>Without Limits.</span>
          </h1>

          {/* Description Paragraph */}
          <p
            style={{
              fontSize: '17px',
              color: '#475569',
              lineHeight: 1.6,
              margin: '0 0 32px 0',
              maxWidth: '520px',
            }}
          >
            BillJi is the all-in-one SaaS platform for businesses and service providers to manage CRM, Sales, Billing, HR, Projects, Support and more — all in one place.
          </p>

          {/* Two CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {/* Primary CTA: Start Free Trial */}
            <Button
              type="primary"
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: '#1468E8',
                borderColor: '#1468E8',
                height: '48px',
                padding: '0 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(20, 104, 232, 0.25)',
              }}
            >
              Start Free Trial <ArrowRightOutlined />
            </Button>

            {/* Secondary CTA: Book a Demo */}
            <Button
              onClick={() => navigate('/contact')}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#CBD5E1',
                color: '#071A3D',
                height: '48px',
                padding: '0 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Book a Demo <CalendarOutlined style={{ color: '#1468E8' }} />
            </Button>
          </div>

          {/* Three Trust Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', color: '#475569', fontWeight: 600, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleFilled style={{ color: '#1468E8', fontSize: '15px' }} />
              <span>14-Day Free Trial</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleFilled style={{ color: '#1468E8', fontSize: '15px' }} />
              <span>No Credit Card</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircleFilled style={{ color: '#1468E8', fontSize: '15px' }} />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard UI Mockup Preview */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 15px rgba(20, 104, 232, 0.05)',
              overflow: 'hidden',
              fontSize: '12px',
              color: '#334155',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                height: '46px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F1F5F9',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <BillJiLogo size="small" showTagline={false} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '180px',
                    color: '#94A3B8',
                    fontSize: '11px',
                  }}
                >
                  <SearchOutlined style={{ fontSize: '12px' }} />
                  <span>Search anything...</span>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: '#1468E8',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <PlusOutlined />
                </div>

                <BellOutlined style={{ fontSize: '14px', color: '#64748B', cursor: 'pointer' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    JD
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '11px', color: '#0F172A' }}>John Doe</span>
                    <span style={{ fontSize: '9px', color: '#64748B' }}>Admin ▾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar + Canvas */}
            <div style={{ display: 'flex', minHeight: '360px' }}>
              {/* Sidebar */}
              <div
                style={{
                  width: '125px',
                  backgroundColor: '#F8FAFC',
                  borderRight: '1px solid #F1F5F9',
                  padding: '10px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1468E8',
                    fontWeight: 600,
                    fontSize: '11px',
                    padding: '5px 8px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <DashboardOutlined style={{ fontSize: '11px' }} />
                  <span>Dashboard</span>
                </div>
                {[
                  { label: 'CRM', icon: <UserOutlined /> },
                  { label: 'Sales', icon: <FileTextOutlined /> },
                  { label: 'Invoicing', icon: <FileTextOutlined /> },
                  { label: 'Projects', icon: <FolderOutlined /> },
                  { label: 'Support', icon: <CustomerServiceOutlined /> },
                  { label: 'HR & Payroll', icon: <TeamOutlined /> },
                  { label: 'Accounting', icon: <BankOutlined /> },
                  { label: 'Reports', icon: <BarChartOutlined /> },
                  { label: 'Settings', icon: <SettingOutlined /> },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      color: '#64748B',
                      fontSize: '11px',
                      padding: '5px 8px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '11px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Canvas Content */}
              <div style={{ flex: 1, padding: '12px 14px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                  Dashboard
                </div>

                {/* 4 KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: '#EFF6FF', padding: '8px', borderRadius: '6px', border: '1px solid #DBEAFE' }}>
                    <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 500 }}>Total Revenue</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', margin: '2px 0' }}>₹24,75,000</div>
                    <div style={{ fontSize: '8px', color: '#16A34A', fontWeight: 600 }}>↑ 12.5% vs last month</div>
                  </div>

                  <div style={{ backgroundColor: '#F0FDF4', padding: '8px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                    <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 500 }}>Total Invoices</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', margin: '2px 0' }}>1,245</div>
                    <div style={{ fontSize: '8px', color: '#16A34A', fontWeight: 600 }}>↑ 8.2% vs last month</div>
                  </div>

                  <div style={{ backgroundColor: '#F5F3FF', padding: '8px', borderRadius: '6px', border: '1px solid #DDD6FE' }}>
                    <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 500 }}>New Customers</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', margin: '2px 0' }}>320</div>
                    <div style={{ fontSize: '8px', color: '#7C3AED', fontWeight: 600 }}>↑ 15.3% vs last month</div>
                  </div>

                  <div style={{ backgroundColor: '#FFF7ED', padding: '8px', borderRadius: '6px', border: '1px solid #FFEDD5' }}>
                    <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 500 }}>Outstanding</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', margin: '2px 0' }}>₹6,25,000</div>
                    <div style={{ fontSize: '8px', color: '#EF4444', fontWeight: 600 }}>↓ 5.1% vs last month</div>
                  </div>
                </div>

                {/* Chart + Activities */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '10px' }}>
                  {/* Revenue Overview Chart */}
                  <div style={{ border: '1px solid #F1F5F9', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>Revenue Overview</span>
                      <span style={{ fontSize: '8px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 5px', borderRadius: '3px' }}>
                        This Month ▾
                      </span>
                    </div>

                    <div style={{ height: '90px', width: '100%' }}>
                      <svg width="100%" height="100%" viewBox="0 0 300 90" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1468E8" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#1468E8" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="45" x2="300" y2="45" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="70" x2="300" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                        <path d="M 0 65 Q 35 50, 70 58 T 140 32 T 210 20 T 280 26 L 300 30 L 300 90 L 0 90 Z" fill="url(#heroChartFill)" />
                        <path d="M 0 65 Q 35 50, 70 58 T 140 32 T 210 20 T 280 26 L 300 30" fill="none" stroke="#1468E8" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="70" cy="58" r="3" fill="#1468E8" />
                        <circle cx="140" cy="32" r="3" fill="#1468E8" />
                        <circle cx="210" cy="20" r="3.5" fill="#FFFFFF" stroke="#1468E8" strokeWidth="2" />
                        <circle cx="280" cy="26" r="3" fill="#1468E8" />
                      </svg>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94A3B8', marginTop: '2px' }}>
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div style={{ border: '1px solid #F1F5F9', borderRadius: '6px', padding: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                      Recent Activities
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { text: 'Invoice #INV-1254 created', time: '2 min ago', color: '#1468E8' },
                        { text: 'Payment received from ABC Corp', time: '15 min ago', color: '#16A34A' },
                        { text: 'New customer registered', time: '1 hour ago', color: '#7C3AED' },
                        { text: 'Project "Website Redesign" updated', time: '2 hours ago', color: '#EA580C' },
                      ].map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: act.color, marginTop: '3px', flexShrink: 0 }} />
                          <div style={{ lineHeight: 1.1 }}>
                            <div style={{ fontSize: '8.5px', fontWeight: 500, color: '#1E293B' }}>{act.text}</div>
                            <div style={{ fontSize: '7.5px', color: '#94A3B8' }}>{act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Handwritten Annotation "Grow Smarter Together" */}
          <div
            style={{
              position: 'absolute',
              right: '-100px',
              top: '40%',
              transform: 'rotate(-8deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
            className="hidden-tablet-mobile"
          >
            <div
              style={{
                fontFamily: "'Comic Sans MS', 'Caveat', 'Brush Script MT', cursive",
                fontSize: '24px',
                fontWeight: 700,
                color: '#1468E8',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              Grow<br />Smarter<br />Together
            </div>
            <svg width="70" height="18" viewBox="0 0 70 18" fill="none">
              <path d="M 4 7 Q 35 16, 66 4" stroke="#1468E8" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .home-hero-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .home-hero-heading {
            font-size: 40px !important;
          }
        }
        @media (max-width: 640px) {
          .home-hero-heading {
            font-size: 32px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroHome;
