import React from 'react';
import {
  AppstoreFilled,
  ThunderboltFilled,
  SafetyCertificateFilled,
  ShopFilled,
  ControlFilled,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

export const TrustedBusinesses: React.FC = () => {
  const partners = [
    { name: 'TechCorp', icon: <DeploymentUnitOutlined style={{ color: '#1468E8' }} /> },
    { name: 'Digital Agency', icon: <AppstoreFilled style={{ color: '#F79009' }} /> },
    { name: 'Consultix', icon: <SafetyCertificateFilled style={{ color: '#12B76A' }} /> },
    { name: 'StoreHub', icon: <ShopFilled style={{ color: '#7C3AED' }} /> },
    { name: 'LogiTrack', icon: <ThunderboltFilled style={{ color: '#2563EB' }} /> },
    { name: 'ServPro', icon: <ControlFilled style={{ color: '#071A3D' }} /> },
  ];

  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E6EBF2',
        borderBottom: '1px solid #E6EBF2',
        padding: '36px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Caption */}
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          TRUSTED BY 10,000+ BUSINESSES WORLDWIDE
        </div>

        {/* 6 Logo Brands Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
          className="trusted-logos-grid"
        >
          {partners.map((brand, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '18px',
                fontWeight: 800,
                color: '#071A3D',
                opacity: 0.85,
                transition: 'opacity 0.2s',
              }}
            >
              <span style={{ fontSize: '22px', display: 'flex', alignItems: 'center' }}>{brand.icon}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.3px' }}>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trusted-logos-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .trusted-logos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedBusinesses;
