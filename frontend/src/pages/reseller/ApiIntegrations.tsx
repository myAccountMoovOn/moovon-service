import React from 'react';
import { Card, Typography, Button, Table, Space, Tag } from 'antd';
import { PlusOutlined, CopyOutlined, DeleteOutlined, ApiOutlined, LinkOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const PRIMARY_COLOR = '#16A34A';

const ApiIntegrations: React.FC = () => {
  const apiKeysData = [
    { key: '1', name: 'Production Key', token: 'sk_live_...a8f9', created: '2023-10-01', lastUsed: 'Just now' },
    { key: '2', name: 'Staging Key', token: 'sk_test_...b2x1', created: '2023-09-15', lastUsed: '2 days ago' },
  ];

  const webhooksData = [
    { key: '1', url: 'https://api.acme.com/webhook', events: ['invoice.paid', 'tenant.created'], status: 'Active', lastTriggered: '10 mins ago' },
    { key: '2', url: 'https://crm.global.net/hook', events: ['tenant.deleted'], status: 'Failing', lastTriggered: '1 day ago' },
  ];

  const logsData = [
    { key: '1', timestamp: '2023-10-25 14:32:01', action: 'API Key Generated', user: 'Admin User', ip: '192.168.1.1' },
    { key: '2', timestamp: '2023-10-24 09:15:22', action: 'Webhook Updated', user: 'Jane Smith', ip: '10.0.0.5' },
    { key: '3', timestamp: '2023-10-22 16:45:10', action: 'Settings Changed', user: 'Admin User', ip: '192.168.1.1' },
  ];

  const apiColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Secret Key', dataIndex: 'token', key: 'token', render: (t: string) => <Text code>{t}</Text> },
    { title: 'Created', dataIndex: 'created', key: 'created' },
    { title: 'Last Used', dataIndex: 'lastUsed', key: 'lastUsed' },
    { 
      title: 'Actions', 
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<CopyOutlined />} style={{ color: PRIMARY_COLOR }} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      )
    },
  ];

  const webhookColumns = [
    { title: 'Endpoint URL', dataIndex: 'url', key: 'url' },
    { 
      title: 'Events', 
      dataIndex: 'events', 
      key: 'events',
      render: (events: string[]) => (
        <>
          {events.map(e => <Tag key={e} color="blue">{e}</Tag>)}
        </>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Badge status={status === 'Active' ? 'success' : 'error'} text={status} />
    },
    { title: 'Last Triggered', dataIndex: 'lastTriggered', key: 'lastTriggered' },
  ];

  const logColumns = [
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
  ];

  // Helper Badge component for webhook status
  const Badge = ({ status, text }: { status: 'success'|'error', text: string }) => (
    <span style={{ color: status === 'success' ? PRIMARY_COLOR : '#ff4d4f' }}>
      ● {text}
    </span>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>API & Integrations</Title>
        <Text type="secondary">Manage your API keys, webhooks, and security logs.</Text>
      </div>

      <Card 
        title={<Space><ApiOutlined /> API Keys</Space>} 
        extra={<Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>Generate New Key</Button>}
        style={{ borderRadius: '12px', marginBottom: '24px' }}
      >
        <Table columns={apiColumns} dataSource={apiKeysData} pagination={false} />
      </Card>

      <Card 
        title={<Space><LinkOutlined /> Webhooks</Space>} 
        extra={<Button type="primary" ghost icon={<PlusOutlined />} style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}>Add Webhook</Button>}
        style={{ borderRadius: '12px', marginBottom: '24px' }}
      >
        <Table columns={webhookColumns} dataSource={webhooksData} pagination={false} />
      </Card>

      <Card 
        title={<Space><SafetyOutlined /> Audit Logs</Space>} 
        style={{ borderRadius: '12px' }}
      >
        <Table columns={logColumns} dataSource={logsData} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default ApiIntegrations;
