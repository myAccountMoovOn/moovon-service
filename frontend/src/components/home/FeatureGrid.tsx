import React from 'react';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

interface FeatureItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, iconBg, iconColor, title, description }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '10px',
      backgroundColor: 'transparent',
      transition: 'transform 0.2s ease',
    }}
  >
    <div
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        backgroundColor: iconBg,
        color: iconColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
        {description}
      </div>
    </div>
  </div>
);

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <UserOutlined />,
      iconBg: '#EFF6FF',
      iconColor: '#155EEF',
      title: 'CRM & Customers',
      description: 'Grow your customer base',
    },
    {
      icon: <FileTextOutlined />,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      title: 'Sales & Invoicing',
      description: 'Create & track payments',
    },
    {
      icon: <TeamOutlined />,
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      title: 'HR & Payroll',
      description: 'Manage your team',
    },
    {
      icon: <FolderOutlined />,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
      title: 'Projects & Tasks',
      description: 'Plan and deliver',
    },
    {
      icon: <CustomerServiceOutlined />,
      iconBg: '#FDF2F8',
      iconColor: '#DB2777',
      title: 'Support Desk',
      description: 'Delight your customers',
    },
    {
      icon: <BarChartOutlined />,
      iconBg: '#ECFEFF',
      iconColor: '#0891B2',
      title: 'Reports & Analytics',
      description: 'Make smarter decisions',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px 16px',
        margin: '28px 0 32px 0',
      }}
      className="feature-grid-container"
    >
      {features.map((item, index) => (
        <FeatureItem key={index} {...item} />
      ))}
    </div>
  );
};

export default FeatureGrid;
