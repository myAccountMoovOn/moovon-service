import React from 'react';
import { Card, Typography, Button, Table, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const PRIMARY_COLOR = '#16A34A';

const StaffRoles: React.FC = () => {
  const staffData = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 mins ago',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'Active',
      lastActive: '5 hours ago',
    },
    {
      key: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Support',
      status: 'Invited',
      lastActive: 'Never',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Space><UserOutlined /> <Text strong>{text}</Text></Space>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'default';
        if (role === 'Admin') color = 'purple';
        if (role === 'Manager') color = 'blue';
        if (role === 'Support') color = 'cyan';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : 'warning'}>{status}</Tag>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} style={{ color: PRIMARY_COLOR }} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const roleCards = [
    {
      title: 'Admin',
      description: 'Full access to all platform features, billing, and settings.',
      color: '#722ED1',
    },
    {
      title: 'Manager',
      description: 'Can view reports, manage tenants, but cannot alter core settings.',
      color: '#1677FF',
    },
    {
      title: 'Support',
      description: 'Access to support tickets and basic tenant information only.',
      color: '#13C2C2',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Staff & Roles</Title>
          <Text type="secondary">Manage your team members and their permissions.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>
          Invite Staff Member
        </Button>
      </div>

      <Card style={{ borderRadius: '12px', marginBottom: '32px' }} bodyStyle={{ padding: 0 }}>
        <Table columns={columns} dataSource={staffData} pagination={false} />
      </Card>

      <Title level={4} style={{ marginBottom: '16px' }}>Available Roles</Title>
      <Row gutter={24}>
        {roleCards.map((role) => (
          <Col xs={24} md={8} key={role.title}>
            <Card style={{ borderRadius: '12px', borderTop: `4px solid ${role.color}` }}>
              <Title level={5}>{role.title}</Title>
              <Paragraph type="secondary" style={{ minHeight: '44px' }}>{role.description}</Paragraph>
              <Button type="link" style={{ padding: 0, color: role.color }}>View Permissions</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StaffRoles;
