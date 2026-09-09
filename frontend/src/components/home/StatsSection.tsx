import React from 'react';
import {
  UserOutlined,
  FileTextOutlined,
  ThunderboltFilled,
  CustomerServiceOutlined,
} from '@ant-design/icons';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '10,000+',
      label: 'Happy Customers',
      subtitle: 'Growing businesses trust BillJi',
      icon: <UserOutlined />,
      iconBg: '#1468E8',
    },
    {
      value: '1M+',
      label: 'Invoices Generated',
      subtitle: 'Streamlined billing and payments',
      icon: <FileTextOutlined />,
      iconBg: '#16A34A',
    },
    {
      value: '99.9%',
      label: 'Uptime',
      subtitle: 'Reliable and always available',
      icon: <ThunderboltFilled />,
      iconBg: '#7C3AED',
    },
    {
      value: '24/7',
      label: 'Customer Support',
      subtitle: "We're here when you need us",
      icon: <CustomerServiceOutlined />,
      iconBg: '#EA580C',
    },
  ];

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '0 24px 72px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Dark Navy Rounded Container */}
        <div
          style={{
            backgroundColor: '#071A3D',
            borderRadius: '16px',
            padding: '40px 36px',
            boxShadow: '0 20px 40px rgba(7, 26, 61, 0.15)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              alignItems: 'center',
            }}
            className="stats-grid-4col"
          >
            {stats.map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Circular Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: stat.iconBg,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  {stat.icon}
                </div>

                {/* Metrics Text */}
                <div>
                  <div
                    style={{
                      fontSize: '26px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: 1.1,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#E2E8F0', marginTop: '2px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid-4col {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid-4col {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
