import React from 'react';
import { Card, Typography, Button, Table, Space, Tag, Tabs, Row, Col, Statistic } from 'antd';
import { MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const PRIMARY_COLOR = '#16A34A';

const SupportTickets: React.FC = () => {
  const ticketsData = [
    {
      key: '1',
      id: 'TCK-1029',
      company: 'Acme Corp',
      subject: 'Payment gateway failing',
      priority: 'High',
      status: 'Open',
      created: '2 hours ago',
    },
    {
      key: '2',
      id: 'TCK-1028',
      company: 'Global Tech',
      subject: 'How to add new tax rate?',
      priority: 'Low',
      status: 'Resolved',
      created: '1 day ago',
    },
    {
      key: '3',
      id: 'TCK-1027',
      company: 'StartUp Inc',
      subject: 'White label branding issue',
      priority: 'Medium',
      status: 'In Progress',
      created: '3 hours ago',
    },
  ];

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text strong style={{ color: PRIMARY_COLOR }}>{text}</Text>,
    },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'default';
        if (priority === 'High') color = 'error';
        if (priority === 'Medium') color = 'warning';
        if (priority === 'Low') color = 'processing';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Resolved') color = 'success';
        if (status === 'Open') color = 'error';
        if (status === 'In Progress') color = 'processing';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space size="middle">
          <Button type="link" style={{ padding: 0, color: PRIMARY_COLOR }}>Reply</Button>
          {record.status !== 'Resolved' && <Button type="link" danger style={{ padding: 0 }}>Close</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Support Tickets</Title>
        <Text type="secondary">Manage issues from your downstream companies.</Text>
      </div>

      <Row gutter={24} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Total Open" value={12} valueStyle={{ color: '#cf1322' }} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="In Progress" value={5} valueStyle={{ color: '#1677ff' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Resolved Today" value={28} valueStyle={{ color: PRIMARY_COLOR }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Avg Response Time" value="1.5h" prefix={<MessageOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }} bodyStyle={{ padding: 0 }}>
        <Tabs
          defaultActiveKey="1"
          style={{ padding: '0 24px' }}
          items={[
            { key: '1', label: 'All Tickets' },
            { key: '2', label: 'Open' },
            { key: '3', label: 'In Progress' },
            { key: '4', label: 'Resolved' },
          ]}
        />
        <Table columns={columns} dataSource={ticketsData} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default SupportTickets;
