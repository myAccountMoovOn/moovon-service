import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Dropdown, Drawer, Grid } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileSyncOutlined,
  CreditCardOutlined,
  NotificationOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
  GiftOutlined,
  DollarOutlined,
  BgColorsOutlined,
  MessageOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CompanyLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { branding, isLoadingBranding } = useBranding();

  const isMobile = !screens.lg;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { key: '/company/dashboard', icon: <DashboardOutlined />, label: 'Enterprise Dashboard' },
    { key: '/company/categories', icon: <TagsOutlined />, label: 'Categories' },
    { key: '/company/services', icon: <AppstoreOutlined />, label: 'Products & Services' },
    { key: '/company/packages', icon: <GiftOutlined />, label: 'Packages' },
    { key: '/company/coupons', icon: <DollarOutlined />, label: 'Coupons' },
    { key: '/company/customers', icon: <TeamOutlined />, label: 'Customers & CRM' },
    { key: '/company/subscriptions', icon: <FileSyncOutlined />, label: 'Subscriptions' },
    { key: '/company/payments', icon: <CreditCardOutlined />, label: 'Payments & Billing' },
    { key: '/company/notifications', icon: <NotificationOutlined />, label: 'Notifications' },
    { key: '/company/templates', icon: <MessageOutlined />, label: 'Templates' },
    { key: '/company/reports', icon: <BarChartOutlined />, label: 'Reports & Analytics' },
    { key: '/company/brand-settings', icon: <BgColorsOutlined />, label: 'White-Label Branding' },
  ];

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Company Settings',
        onClick: () => navigate('/company/brand-settings'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  const SideMenu = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => {
        navigate(key);
        if (isMobile) setDrawerVisible(false);
      }}
      style={{ borderRight: 0, marginTop: 16 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile ? (
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ borderRight: '1px solid var(--color-border)' }}>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)', gap: 8, padding: '0 8px' }}>
            {!isLoadingBranding && (
              branding?.logo ? (
                <>
                  <img src={branding.logo} alt="Logo" style={{ maxHeight: 36, maxWidth: collapsed ? 36 : 100, objectFit: 'contain', flexShrink: 0 }} />
                  {!collapsed && (
                    <Title level={5} style={{ margin: 0, color: '#1468E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
                      {branding?.appName || branding?.name || 'Company Hub'}
                    </Title>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BankOutlined style={{ fontSize: '20px', color: '#1468E8' }} />
                  {!collapsed && (
                    <Title level={5} style={{ margin: 0, color: '#1468E8' }}>
                      {branding?.appName || 'Company Hub'}
                    </Title>
                  )}
                </div>
              )
            )}
          </div>
          {SideMenu}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          size="default"
          styles={{ body: { padding: 0 } }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BankOutlined style={{ fontSize: '20px', color: '#1468E8' }} />
              <Title level={4} style={{ margin: 0, color: '#1468E8' }}>
                {branding?.appName || 'Company Hub'}
              </Title>
            </div>
          }
        >
          {SideMenu}
        </Drawer>
      )}
      <Layout>
        <Header style={{ padding: '0 24px', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
          <Button
            type="text"
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -24 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Button type="text" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined />
                {!isMobile && <Text strong>{user?.email}</Text>}
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: isMobile ? '12px' : '24px', background: 'var(--color-bg-primary)', borderRadius: '8px', padding: isMobile ? 16 : 24, overflow: 'initial' }} className="card-shadow">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CompanyLayout;
