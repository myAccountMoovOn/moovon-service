import React from 'react';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const HomeFeatureCards: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'CRM & Customers',
      description: 'Manage leads, customers, and relationships in one place.',
      icon: <UserOutlined />,
      iconBg: '#EFF6FF',
      iconColor: '#1468E8',
      link: '/signup',
    },
    {
      title: 'Sales & Invoicing',
      description: 'Create quotes, invoices and track payments effortlessly.',
      icon: <FileTextOutlined />,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      link: '/signup',
    },
    {
      title: 'HR & Payroll',
      description: 'Manage employees, attendance, payroll and compliance.',
      icon: <TeamOutlined />,
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      link: '/signup',
    },
    {
      title: 'Projects & Tasks',
      description: 'Plan projects, assign tasks and track progress in real-time.',
      icon: <FolderOutlined />,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
      link: '/signup',
    },
    {
      title: 'Support Desk',
      description: 'Manage tickets, support and customer satisfaction.',
      icon: <CustomerServiceOutlined />,
      iconBg: '#FDF2F8',
      iconColor: '#DB2777',
      link: '/signup',
    },
    {
      title: 'Reports & Analytics',
      description: 'Powerful reports and insights to make smarter decisions.',
      icon: <BarChartOutlined />,
      iconBg: '#ECFEFF',
      iconColor: '#0891B2',
      link: '/signup',
    },
  ];

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '72px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#EFF6FF',
              color: '#1468E8',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            POWERFUL FEATURES
          </div>

          <h2
            style={{
              fontSize: '38px',
              fontWeight: 800,
              color: '#071A3D',
              margin: '0 0 12px 0',
              letterSpacing: '-0.8px',
            }}
          >
            Everything You Need to Succeed
          </h2>

          <p style={{ fontSize: '16px', color: '#64748B', margin: 0, maxWidth: '600px', marginInline: 'auto' }}>
            From customer management to invoicing, from projects to payroll — BillJi has you covered.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
          }}
          className="home-features-6col"
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6EBF2',
                borderRadius: '14px',
                padding: '22px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => navigate(card.link)}
            >
              <div>
                {/* Icon Container */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: card.iconBg,
                    color: card.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginBottom: '16px',
                  }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#071A3D',
                    margin: '0 0 8px 0',
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    lineHeight: 1.5,
                    margin: '0 0 16px 0',
                  }}
                >
                  {card.description}
                </p>
              </div>

              {/* Learn More Link */}
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1468E8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Learn More</span> <ArrowRightOutlined style={{ fontSize: '11px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .home-features-6col {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .home-features-6col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeFeatureCards;
