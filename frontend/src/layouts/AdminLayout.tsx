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
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isMobile = !screens.lg;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/customers', icon: <TeamOutlined />, label: 'Customers' },
    { key: '/admin/services', icon: <AppstoreOutlined />, label: 'Services' },
    { key: '/admin/subscriptions', icon: <FileSyncOutlined />, label: 'Subscriptions' },
    { key: '/admin/payments', icon: <CreditCardOutlined />, label: 'Payments' },
    { key: '/admin/notifications', icon: <NotificationOutlined />, label: 'Notifications' },
    { key: '/admin/reports', icon: <BarChartOutlined />, label: 'Reports' },
  ];

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
    ]
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
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
            <Title level={4} style={{ margin: 0, color: 'var(--color-primary)' }}>
              {collapsed ? 'M' : 'Moovon'}
            </Title>
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
          title={<Title level={4} style={{ margin: 0, color: 'var(--color-primary)' }}>Moovon</Title>}
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
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button type="text" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined />
              {!isMobile && <Text>{user?.email}</Text>}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: isMobile ? '12px' : '24px', background: 'var(--color-bg-primary)', borderRadius: '8px', padding: isMobile ? 16 : 24, overflow: 'initial' }} className="card-shadow">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
