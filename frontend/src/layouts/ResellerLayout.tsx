import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Tooltip } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
  ApiOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  BellOutlined,
  BuildOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  MailOutlined,
  ShopOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import BillJiLogo from '../components/common/BillJiLogo';
import { useAuth } from '../context/AuthContext';
import { getCompanySlug } from '../utils/slug';

const { Header, Sider, Content } = Layout;

const ResellerLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resellerSlug: urlSlug } = useParams<{ resellerSlug?: string }>();
  const { user, signOut } = useAuth();

  const activeSlug = urlSlug || getCompanySlug(user);
  const currentPrefix = `/${activeSlug}`;

  const handleLogout = async () => {
    await signOut(); // clears localStorage + calls supabase.auth.signOut()
    navigate('/login');
  };

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile Settings' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
    ],
  };

  const menuItems = [
    {
      key: `${currentPrefix}/dashboard`,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'tenant-management',
      icon: <ShopOutlined />,
      label: 'Tenant Management',
      children: [
        { key: `${currentPrefix}/companies`, icon: <TeamOutlined />, label: 'Companies' },
        { key: `${currentPrefix}/tenant-billing`, icon: <CreditCardOutlined />, label: 'Subscriptions & Billing' },
      ],
    },
    {
      key: 'commercials',
      icon: <AppstoreOutlined />,
      label: 'Commercials & Packaging',
      children: [
        { key: `${currentPrefix}/plan-builder`, icon: <BuildOutlined />, label: 'Plan Builder' },
        { key: `${currentPrefix}/feature-limits`, icon: <SafetyCertificateOutlined />, label: 'Feature Limits' },
        { key: `${currentPrefix}/add-ons`, icon: <PlusSquareOutlined />, label: 'Add-ons' },
      ],
    },
    {
      key: 'configuration',
      icon: <SettingOutlined />,
      label: 'Configuration',
      children: [
        { key: `${currentPrefix}/payment-gateways`, icon: <BankOutlined />, label: 'Payment Gateways' },
        { key: `${currentPrefix}/communications`, icon: <MailOutlined />, label: 'Communications' },
        { key: `${currentPrefix}/white-label`, icon: <GlobalOutlined />, label: 'White-Label Branding' },
      ],
    },
    {
      key: 'administration',
      icon: <CustomerServiceOutlined />,
      label: 'Administration',
      children: [
        { key: `${currentPrefix}/staff-roles`, icon: <UserOutlined />, label: 'Staff & Roles' },
        { key: `${currentPrefix}/support-tickets`, icon: <CustomerServiceOutlined />, label: 'Support Tickets' },
        { key: `${currentPrefix}/reports`, icon: <BarChartOutlined />, label: 'Reports & Analytics' },
        { key: `${currentPrefix}/api-integrations`, icon: <ApiOutlined />, label: 'API & Integrations' },
      ],
    },
  ];

  // Determine which group key should be open based on current path
  const openKeys = (() => {
    const path = location.pathname;
    if (path.includes('/companies') || path.includes('/tenant-billing')) return ['tenant-management'];
    if (path.includes('/plan-builder') || path.includes('/feature-limits') || path.includes('/add-ons')) return ['commercials'];
    if (path.includes('/payment-gateways') || path.includes('/communications') || path.includes('/white-label')) return ['configuration'];
    if (path.includes('/staff-roles') || path.includes('/support-tickets') || path.includes('/reports') || path.includes('/api-integrations')) return ['administration'];
    return [];
  })();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={240}
        style={{
          borderRight: '1px solid #f0f0f0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #f0f0f0', marginBottom: 8 }}>
          <BillJiLogo size={collapsed ? 'small' : 'medium'} showTagline={false} />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#064E3B' }}>Reseller Portal</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Tooltip title="Notifications">
              <Badge count={3} size="small">
                <BellOutlined style={{ fontSize: 18, color: '#6B7280', cursor: 'pointer' }} />
              </Badge>
            </Tooltip>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#16A34A' }} icon={<UserOutlined />} />
                {!collapsed && <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>My Account</span>}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px',
            background: '#F9FAFB',
            borderRadius: 12,
            minHeight: 280,
            overflow: 'visible',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ResellerLayout;
