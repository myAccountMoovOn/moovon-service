import React, { useState } from 'react';
import { Typography, Table, Tag, Button, Input, Space, Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined, EyeOutlined, StopOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface CompanyDataType {
  key: string;
  name: string;
  plan: string;
  status: 'Active' | 'Suspended' | 'Trial';
  mrr: string;
  joinedDate: string;
}

const mockData: CompanyDataType[] = [
  { key: '1', name: 'Acme Corp', plan: 'Platinum', status: 'Active', mrr: '$1,200', joinedDate: '2025-01-15' },
  { key: '2', name: 'TechFlow', plan: 'Gold', status: 'Active', mrr: '$800', joinedDate: '2025-03-22' },
  { key: '3', name: 'Global Industries', plan: 'Silver', status: 'Suspended', mrr: '$300', joinedDate: '2024-11-05' },
  { key: '4', name: 'Startup Hub', plan: 'Starter', status: 'Trial', mrr: '$0', joinedDate: '2026-08-10' },
  { key: '5', name: 'CloudSync', plan: 'Gold', status: 'Active', mrr: '$800', joinedDate: '2026-05-18' },
];

const Companies: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Suspended' | 'Trial'>('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Suspended': return 'red';
      case 'Trial': return 'orange';
      default: return 'default';
    }
  };

  const actionMenu: MenuProps['items'] = [
    { key: '1', label: 'View Details', icon: <EyeOutlined /> },
    { key: '2', label: 'Edit Company', icon: <EditOutlined /> },
    { type: 'divider' },
    { key: '3', label: 'Suspend', icon: <StopOutlined />, danger: true },
  ];

  const columns: ColumnsType<CompanyDataType> = [
    { title: 'Company Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'Plan', dataIndex: 'plan', key: 'plan' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: 'MRR', dataIndex: 'mrr', key: 'mrr' },
    { title: 'Joined Date', dataIndex: 'joinedDate', key: 'joinedDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Dropdown menu={{ items: actionMenu }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredData = filter === 'All' ? mockData : mockData.filter(item => item.status === filter);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Companies</Title>
          <Text type="secondary">Manage your downstream B2B customers and their subscriptions.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#16A34A' }}>
          Provision New Company
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type={filter === 'All' ? 'primary' : 'default'} onClick={() => setFilter('All')} style={filter === 'All' ? { backgroundColor: '#16A34A', borderColor: '#16A34A', color: '#fff' } : {}}>All</Button>
            <Button type={filter === 'Active' ? 'primary' : 'default'} onClick={() => setFilter('Active')} style={filter === 'Active' ? { backgroundColor: '#16A34A', borderColor: '#16A34A', color: '#fff' } : {}}>Active</Button>
            <Button type={filter === 'Trial' ? 'primary' : 'default'} onClick={() => setFilter('Trial')} style={filter === 'Trial' ? { backgroundColor: '#16A34A', borderColor: '#16A34A', color: '#fff' } : {}}>Trial</Button>
            <Button type={filter === 'Suspended' ? 'primary' : 'default'} onClick={() => setFilter('Suspended')} style={filter === 'Suspended' ? { backgroundColor: '#16A34A', borderColor: '#16A34A', color: '#fff' } : {}}>Suspended</Button>
          </Space>
          <Input placeholder="Search companies..." prefix={<SearchOutlined />} style={{ width: 250 }} />
        </div>
        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Companies;
