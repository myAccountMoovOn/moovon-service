import React from 'react';
import { Card, Tabs, Form, Input, Button, Typography, Table, Space, Divider, Row, Col } from 'antd';
import { SendOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const PRIMARY_COLOR = '#16A34A';

const Communications: React.FC = () => {
  const [form] = Form.useForm();

  const templatesColumns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Text style={{ color: PRIMARY_COLOR }}><CheckCircleOutlined /> Active</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} type="text" />
          <Button icon={<EditOutlined />} type="text" style={{ color: PRIMARY_COLOR }} />
        </Space>
      ),
    },
  ];

  const emailTemplates = [
    { key: '1', name: 'Welcome Email', subject: 'Welcome to our platform!' },
    { key: '2', name: 'Invoice Generated', subject: 'Your new invoice is ready' },
    { key: '3', name: 'Password Reset', subject: 'Reset your password' },
  ];

  const renderEmailConfig = () => (
    <Row gutter={24}>
      <Col xs={24} lg={8}>
        <Card title="SMTP Configuration" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Form form={form} layout="vertical">
            <Form.Item label="SMTP Host" name="host" initialValue="smtp.mailgun.org">
              <Input />
            </Form.Item>
            <Form.Item label="SMTP Port" name="port" initialValue="587">
              <Input />
            </Form.Item>
            <Form.Item label="Username" name="username" initialValue="postmaster@yourdomain.com">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="••••••••" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ backgroundColor: PRIMARY_COLOR, width: '100%' }}>Save Configuration</Button>
            </Form.Item>
            <Divider />
            <Button icon={<SendOutlined />} style={{ width: '100%' }}>Send Test Email</Button>
          </Form>
        </Card>
      </Col>
      <Col xs={24} lg={16}>
        <Card title="Email Templates" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Table columns={templatesColumns} dataSource={emailTemplates} pagination={false} />
        </Card>
      </Col>
    </Row>
  );

  const renderGenericConfig = (provider: string) => (
    <Card title={`${provider} Configuration`} bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
       <Form layout="vertical">
          <Form.Item label="API Key">
            <Input.Password placeholder={`Enter ${provider} API Key`} />
          </Form.Item>
          <Form.Item label="Sender ID">
            <Input placeholder="Enter Sender ID" />
          </Form.Item>
          <Button type="primary" style={{ backgroundColor: PRIMARY_COLOR }}>Save {provider} Settings</Button>
       </Form>
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Communications</Title>
        <Text type="secondary">Manage your Email, SMS, and WhatsApp configurations and templates.</Text>
      </div>

      <Tabs defaultActiveKey="email" items={[
        {
          key: 'email',
          label: 'Email',
          children: renderEmailConfig(),
        },
        {
          key: 'sms',
          label: 'SMS',
          children: renderGenericConfig('SMS Provider'),
        },
        {
          key: 'whatsapp',
          label: 'WhatsApp',
          children: renderGenericConfig('WhatsApp API'),
        }
      ]} />
    </div>
  );
};

export default Communications;
