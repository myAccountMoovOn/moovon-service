import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Dropdown, Drawer, Grid, Space } from 'antd';
import {
  DashboardOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const isMobile = !screens.md;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { key: '/customer/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/customer/notifications', icon: <BellOutlined />, label: 'Notifications' },
    { key: '/customer/billing', icon: <CreditCardOutlined />, label: 'Billing & History' },
  ];

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile Settings', onClick: () => navigate('/customer/profile') },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
    ]
  };

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: 'var(--color-bg-primary)', 
        borderBottom: '1px solid var(--color-border)', 
        padding: isMobile ? '0 16px' : '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%'
      }}>
        {isMobile && (
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={toggleDrawer} 
            style={{ fontSize: '18px', marginRight: 8 }}
          />
        )}
        
        <Title level={4} style={{ margin: 0, color: 'var(--color-primary)', marginRight: isMobile ? 0 : 48, flex: isMobile ? 1 : 'none', textAlign: isMobile ? 'center' : 'left' }}>
          Moovon
        </Title>

        {!isMobile && (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, borderBottom: 0 }}
          />
        )}

        <Dropdown menu={userMenu} placement="bottomRight">
          <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: isMobile ? '4px' : undefined }}>
            <UserOutlined />
            {!isMobile && <Text>{user?.email}</Text>}
          </Button>
        </Dropdown>
      </Header>

      <Drawer
        title="Moovon Navigation"
        placement="left"
        onClose={toggleDrawer}
        open={drawerVisible}
        styles={{ 
          body: { padding: 0 },
          wrapper: { width: 280 } 
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <Text type="secondary">{user?.email}</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            setDrawerVisible(false);
          }}
          style={{ borderRight: 0 }}
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <Button type="link" danger icon={<LogoutOutlined />} onClick={handleLogout} block style={{ textAlign: 'left', padding: 0 }}>
            Logout
          </Button>
        </div>
      </Drawer>

      <Content style={{ 
        padding: isMobile ? '16px' : '24px 48px', 
        maxWidth: 1200, 
        margin: '0 auto', 
        width: '100%' 
      }}>
        <div className="card-shadow" style={{ 
          background: 'var(--color-bg-primary)', 
          padding: isMobile ? 16 : 24, 
          minHeight: 400,
          borderRadius: isMobile ? 0 : 12
        }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default CustomerLayout;
