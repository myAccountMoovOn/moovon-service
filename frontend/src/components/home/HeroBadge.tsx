import React from 'react';
import { ThunderboltFilled } from '@ant-design/icons';

export const HeroBadge: React.FC = () => {
  return (
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
      <ThunderboltFilled style={{ fontSize: '13px', color: '#155EEF' }} />
      <span>All-in-One Business Management Platform</span>
    </div>
  );
};

export default HeroBadge;
