import React from 'react';
import { Typography, Table, Button, Card, Switch, Input } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface FeatureType {
  key: string;
  module: string;
  starter: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
  platinum: string | boolean;
}

const mockData: FeatureType[] = [
  { key: '1', module: 'CRM Module', starter: true, silver: true, gold: true, platinum: true },
  { key: '2', module: 'Invoicing Module', starter: true, silver: true, gold: true, platinum: true },
  { key: '3', module: 'HR Module', starter: false, silver: true, gold: true, platinum: true },
  { key: '4', module: 'Projects Module', starter: false, silver: false, gold: true, platinum: true },
  { key: '5', module: 'Storage Limit', starter: '10GB', silver: '50GB', gold: '200GB', platinum: '1TB' },
  { key: '6', module: 'API Calls/mo', starter: '1,000', silver: '10,000', gold: '100,000', platinum: 'Unlimited' },
  { key: '7', module: 'Max Customers', starter: '100', silver: '500', gold: '5,000', platinum: 'Unlimited' },
];

const FeatureLimits: React.FC = () => {

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return <Switch defaultChecked={value} style={value ? { backgroundColor: '#16A34A' } : {}} />;
    }
    return <Input defaultValue={value} style={{ width: '100px', textAlign: 'center' }} />;
  };

  const columns: ColumnsType<FeatureType> = [
    { 
      title: 'Module / Feature', 
      dataIndex: 'module', 
      key: 'module',
      render: (text) => <Text strong>{text}</Text>,
      width: '25%',
    },
    { title: 'Starter', dataIndex: 'starter', key: 'starter', align: 'center', render: renderCell },
    { title: 'Silver', dataIndex: 'silver', key: 'silver', align: 'center', render: renderCell },
    { title: 'Gold', dataIndex: 'gold', key: 'gold', align: 'center', render: renderCell },
    { title: 'Platinum', dataIndex: 'platinum', key: 'platinum', align: 'center', render: renderCell },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Feature Limits</Title>
          <Text type="secondary">Configure usage limits and module availability across plans.</Text>
        </div>
        <Button type="primary" icon={<SaveOutlined />} style={{ backgroundColor: '#16A34A' }}>
          Save Changes
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table 
          columns={columns} 
          dataSource={mockData} 
          pagination={false}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default FeatureLimits;
