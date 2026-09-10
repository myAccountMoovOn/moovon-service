import React from 'react';
import {
  BellOutlined,
  SearchOutlined,
  DownOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import BillJiLogo from '../common/BillJiLogo';

export const DashboardPreview: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', margin: '24px 0 36px 0' }}>
      {/* Visual Container for Dashboard Preview */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 15px rgba(21, 94, 239, 0.04)',
          overflow: 'hidden',
          fontSize: '12px',
          color: '#334155',
        }}
      >
        {/* Dashboard Top Header Bar */}
        <div
          style={{
            height: '48px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <BillJiLogo size="small" showTagline={false} />

          {/* Search field */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: '200px',
              color: '#94A3B8',
              fontSize: '11px',
            }}
          >
            <SearchOutlined style={{ fontSize: '12px' }} />
            <span>Search anything...</span>
          </div>

          {/* User & Notification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <BellOutlined style={{ fontSize: '15px', color: '#64748B' }} />
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
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

        {/* Sidebar + Main Content Body */}
        <div style={{ display: 'flex', minHeight: '380px' }}>
          {/* Mini Sidebar */}
          <div
            style={{
              width: '130px',
              backgroundColor: '#F8FAFC',
              borderRight: '1px solid #F1F5F9',
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                backgroundColor: '#EFF6FF',
                color: '#155EEF',
                fontWeight: 600,
                fontSize: '11px',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <DashboardOutlined style={{ fontSize: '12px' }} />
              <span>Dashboard</span>
            </div>

            {[
              { label: 'CRM', icon: <UserOutlined /> },
              { label: 'Sales', icon: <FileTextOutlined /> },
              { label: 'Projects', icon: <FolderOutlined /> },
              { label: 'HR & Payroll', icon: <TeamOutlined /> },
              { label: 'Reports', icon: <BarChartOutlined /> },
              { label: 'Settings', icon: <SettingOutlined /> },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  color: '#64748B',
                  fontWeight: 500,
                  fontSize: '11px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '12px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Main Dashboard Canvas */}
          <div style={{ flex: 1, padding: '14px 18px', backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Welcome back, John!
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>
                Here's what's happening with your business today.
              </div>
            </div>

            {/* 4 Summary Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 500 }}>Total Customers</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>1,245</div>
                <div style={{ fontSize: '9px', color: '#16A34A', fontWeight: 600 }}>↑ 12%</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 500 }}>Total Invoices</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>₹24,75,000</div>
                <div style={{ fontSize: '9px', color: '#16A34A', fontWeight: 600 }}>↑ 8%</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 500 }}>Projects</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>320</div>
                <div style={{ fontSize: '9px', color: '#7C3AED', fontWeight: 600 }}>↑ 15%</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 500 }}>Pending Payments</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '3px 0' }}>₹6,25,000</div>
                <div style={{ fontSize: '9px', color: '#EA580C', fontWeight: 600 }}>↑ 5%</div>
              </div>
            </div>

            {/* Split Chart + Activities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px' }}>
              {/* Chart */}
              <div
                style={{
                  border: '1px solid #F1F5F9',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>Revenue Overview</span>
                  <span style={{ fontSize: '9px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                    This Month ▾
                  </span>
                </div>

                {/* Vector Line Graph */}
                <div style={{ position: 'relative', height: '110px', width: '100%' }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#155EEF" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#155EEF" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Area path */}
                    <path
                      d="M 0 75 Q 35 60, 70 68 T 140 40 T 210 25 T 280 30 L 300 35 L 300 100 L 0 100 Z"
                      fill="url(#chartFill)"
                    />

                    {/* Curved Line */}
                    <path
                      d="M 0 75 Q 35 60, 70 68 T 140 40 T 210 25 T 280 30 L 300 35"
                      fill="none"
                      stroke="#155EEF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    <circle cx="70" cy="68" r="3" fill="#155EEF" />
                    <circle cx="140" cy="40" r="3" fill="#155EEF" />
                    <circle cx="210" cy="25" r="3.5" fill="#FFFFFF" stroke="#155EEF" strokeWidth="2" />
                    <circle cx="280" cy="30" r="3" fill="#155EEF" />
                  </svg>
                </div>

                {/* X Axis Labels */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '8px',
                    color: '#94A3B8',
                    marginTop: '4px',
                    padding: '0 4px',
                  }}
                >
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>

              {/* Recent Activities */}
              <div
                style={{
                  border: '1px solid #F1F5F9',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  Recent Activities
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { text: 'New customer registered', time: '2 min ago', color: '#155EEF' },
                    { text: 'Invoice #INV-1254 created', time: '15 min ago', color: '#16A34A' },
                    { text: 'Payment received from ABC Corp', time: '1 hour ago', color: '#7C3AED' },
                    { text: 'Project "Website Redesign" updated', time: '2 hours ago', color: '#EA580C' },
                  ].map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: act.color,
                          marginTop: '3px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ lineHeight: 1.1 }}>
                        <div style={{ fontSize: '9px', fontWeight: 500, color: '#1E293B' }}>{act.text}</div>
                        <div style={{ fontSize: '8px', color: '#94A3B8' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cursive "Grow Smarter Together" Handwritten Annotation */}
      <div
        style={{
          position: 'absolute',
          right: '-110px',
          top: '42%',
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
            color: '#1E66F5',
            lineHeight: 1.1,
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(30, 102, 245, 0.1)',
          }}
        >
          Grow<br />Smarter<br />Together
        </div>

        {/* Curved blue underline stroke */}
        <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
          <path
            d="M 5 8 Q 40 18, 75 5"
            stroke="#155EEF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default DashboardPreview;
