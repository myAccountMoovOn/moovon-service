import React from 'react';
import { SafetyCertificateFilled, CloudFilled, TeamOutlined } from '@ant-design/icons';

export const TrustIndicators: React.FC = () => {
  const items = [
    {
      icon: <SafetyCertificateFilled style={{ color: '#155EEF', fontSize: '24px' }} />,
      title: 'Secure & Reliable',
      description: 'Your data is always safe',
    },
    {
      icon: <CloudFilled style={{ color: '#155EEF', fontSize: '24px' }} />,
      title: 'Access Anywhere',
      description: 'On desktop, tablet or mobile',
    },
    {
      icon: <TeamOutlined style={{ color: '#155EEF', fontSize: '24px' }} />,
      title: 'Trusted by 10,000+ Businesses',
      description: 'Across India and beyond',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 0',
        marginTop: '12px',
        borderTop: '1px solid #E2E8F0',
      }}
      className="trust-indicators-container"
    >
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {item.title}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;
