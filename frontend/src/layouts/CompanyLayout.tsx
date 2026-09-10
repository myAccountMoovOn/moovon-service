import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Dropdown, Drawer, Grid } from 'antd';
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  AuditOutlined,
  AccountBookOutlined,
  PayCircleOutlined,
  FieldTimeOutlined,
  FileSyncOutlined,
  ToolOutlined,
  CarOutlined,
  DatabaseOutlined,
  CustomerServiceOutlined,
  ProjectOutlined,
  UserOutlined,
  NotificationOutlined,
  RobotOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  ClusterOutlined,
  ApiOutlined,
  BgColorsOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
  SettingOutlined,
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

  // Structured Company Sidebar items grouped into sub-menus
  const menuItems = [
    { key: '/company/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    
    {
      key: 'sub-sales',
      icon: <ShoppingCartOutlined />,
      label: 'Sales & CRM',
      children: [
        { key: '/company/crm', icon: <UsergroupAddOutlined />, label: 'CRM & Leads' },
        { key: '/company/customers', icon: <TeamOutlined />, label: 'Customers' },
        { key: '/company/sales', icon: <DollarOutlined />, label: 'Sales' },
        { key: '/company/billing', icon: <FileTextOutlined />, label: 'Billing & Invoicing' },
      ],
    },

    {
      key: 'sub-products',
      icon: <InboxOutlined />,
      label: 'Products & Inventory',
      children: [
        { key: '/company/products', icon: <ShoppingOutlined />, label: 'Products' },
        { key: '/company/services', icon: <AppstoreOutlined />, label: 'Services' },
        { key: '/company/inventory', icon: <DatabaseOutlined />, label: 'Inventory' },
        { key: '/company/purchase', icon: <FileTextOutlined />, label: 'Purchase' },
      ],
    },

    {
      key: 'sub-finance',
      icon: <AccountBookOutlined />,
      label: 'Finance & Accounting',
      children: [
        { key: '/company/accounts', icon: <AccountBookOutlined />, label: 'Accounts & Ledger' },
        { key: '/company/gst-tax', icon: <AuditOutlined />, label: 'GST / Tax' },
        { key: '/company/expenses', icon: <PayCircleOutlined />, label: 'Expenses' },
      ],
    },

    {
      key: 'sub-contracts',
      icon: <ToolOutlined />,
      label: 'Contracts & Field Ops',
      children: [
        { key: '/company/amc', icon: <FieldTimeOutlined />, label: 'AMC Contracts' },
        { key: '/company/subscriptions', icon: <FileSyncOutlined />, label: 'Subscriptions' },
        { key: '/company/service-jobs', icon: <ToolOutlined />, label: 'Service Jobs' },
        { key: '/company/field-staff', icon: <CarOutlined />, label: 'Field Staff' },
        { key: '/company/assets', icon: <AppstoreOutlined />, label: 'Assets Management' },
      ],
    },

    {
      key: 'sub-hr',
      icon: <TeamOutlined />,
      label: 'HR & Support',
      children: [
        { key: '/company/hrms', icon: <UserOutlined />, label: 'HRMS & Payroll' },
        { key: '/company/support-tickets', icon: <CustomerServiceOutlined />, label: 'Support & Tickets' },
        { key: '/company/tasks-projects', icon: <ProjectOutlined />, label: 'Tasks & Projects' },
      ],
    },

    {
      key: 'sub-marketing',
      icon: <NotificationOutlined />,
      label: 'Marketing & Automation',
      children: [
        { key: '/company/marketing', icon: <NotificationOutlined />, label: 'Marketing' },
        { key: '/company/automation', icon: <RobotOutlined />, label: 'Automation Engine' },
        { key: '/company/documents', icon: <FolderOpenOutlined />, label: 'Documents' },
      ],
    },

    {
      key: 'sub-settings',
      icon: <SettingOutlined />,
      label: 'Analytics & Settings',
      children: [
        { key: '/company/reports', icon: <BarChartOutlined />, label: 'Reports & Analytics' },
        { key: '/company/branches', icon: <ClusterOutlined />, label: 'Branches' },
        { key: '/company/api-webhooks', icon: <ApiOutlined />, label: 'API & Webhooks' },
        { key: '/company/brand-settings', icon: <BgColorsOutlined />, label: 'White-Label Branding' },
      ],
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Company Profile & Settings',
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
      style={{ borderRight: 0, marginTop: 12, paddingBottom: 24 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile ? (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={250}
          style={{
            borderRight: '1px solid var(--color-border)',
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
            left: 0,
          }}
        >
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)', gap: 8, padding: '0 12px' }}>
            {!isLoadingBranding && (
              branding?.logo ? (
                <>
                  <img src={branding.logo} alt="Logo" style={{ maxHeight: 36, maxWidth: collapsed ? 36 : 110, objectFit: 'contain', flexShrink: 0 }} />
                  {!collapsed && (
                    <Title level={5} style={{ margin: 0, color: '#1468E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>
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
        <Header style={{ padding: '0 24px', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', sticky: 'top', zIndex: 100 }}>
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
