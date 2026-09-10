import React, { useState } from 'react';
import { Typography, Table, Tag, Button, Card, Row, Col, Statistic, Tabs } from 'antd';
import { FileTextOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface BillingDataType {
  key: string;
  company: string;
  plan: string;
  billingCycle: string;
  nextRenewal: string;
  amount: string;
  status: 'Paid' | 'Overdue' | 'Pending';
}

const mockData: BillingDataType[] = [
  { key: '1', company: 'Acme Corp', plan: 'Platinum', billingCycle: 'Monthly', nextRenewal: '2026-10-15', amount: '$1,200', status: 'Paid' },
  { key: '2', company: 'TechFlow', plan: 'Gold', billingCycle: 'Annual', nextRenewal: '2027-03-22', amount: '$9,600', status: 'Pending' },
  { key: '3', company: 'Global Industries', plan: 'Silver', billingCycle: 'Monthly', nextRenewal: '2026-09-05', amount: '$300', status: 'Overdue' },
  { key: '4', company: 'CloudSync', plan: 'Gold', billingCycle: 'Monthly', nextRenewal: '2026-10-18', amount: '$800', status: 'Paid' },
];

const TenantBilling: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Overdue': return 'red';
      case 'Pending': return 'orange';
      default: return 'default';
    }
  };

  const columns: ColumnsType<BillingDataType> = [
    { title: 'Company', dataIndex: 'company', key: 'company', render: (text) => <Text strong>{text}</Text> },
    { title: 'Plan', dataIndex: 'plan', key: 'plan' },
    { title: 'Billing Cycle', dataIndex: 'billingCycle', key: 'billingCycle' },
    { title: 'Next Renewal', dataIndex: 'nextRenewal', key: 'nextRenewal' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { 
      title: 'Payment Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<FileTextOutlined />} style={{ color: '#16A34A' }}>
          View Invoice
        </Button>
      ),
    },
  ];

  const filteredData = filter === 'All' ? mockData : mockData.filter(item => item.status === filter);

  const tabItems = [
    { key: 'All', label: 'All Invoices' },
    { key: 'Paid', label: 'Paid' },
    { key: 'Overdue', label: 'Overdue' },
    { key: 'Pending', label: 'Pending' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Tenant Billing</Title>
        <Text type="secondary">Monitor subscriptions, payments, and billing history across all tenants.</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Total MRR"
              value={14500}
              precision={2}
              valueStyle={{ color: '#16A34A' }}
              prefix="$"
              suffix={<><ArrowUpOutlined style={{ fontSize: '14px', marginLeft: '8px' }} /><span style={{ fontSize: '14px' }}>12%</span></>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Overdue Accounts"
              value={3}
              valueStyle={{ color: '#cf1322' }}
              suffix={<><ArrowDownOutlined style={{ fontSize: '14px', marginLeft: '8px' }} /><span style={{ fontSize: '14px' }}>1</span></>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Renewals This Week"
              value={12}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs items={tabItems} onChange={setFilter} />
        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default TenantBilling;
