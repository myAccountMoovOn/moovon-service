import React from 'react';
import { Typography, Table, Tag, Button, Card, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface AddOnType {
  key: string;
  name: string;
  price: string;
  unit: string;
  status: 'Active' | 'Inactive';
}

const mockData: AddOnType[] = [
  { key: '1', name: 'Extra Storage 10GB', price: '$5', unit: 'per month', status: 'Active' },
  { key: '2', name: 'Additional Users 5-pack', price: '$20', unit: 'per month', status: 'Active' },
  { key: '3', name: 'Priority Support', price: '$50', unit: 'per month', status: 'Active' },
  { key: '4', name: 'Custom Domain', price: '$15', unit: 'per month', status: 'Active' },
  { key: '5', name: 'SMS Credits 1000', price: '$10', unit: 'one-time', status: 'Inactive' },
];

const AddOns: React.FC = () => {

  const actionMenu: MenuProps['items'] = [
    { key: '1', label: 'Edit Add-on', icon: <EditOutlined /> },
    { key: '2', label: 'Deactivate', icon: <StopOutlined /> },
    { type: 'divider' },
    { key: '3', label: 'Delete', icon: <DeleteOutlined />, danger: true },
  ];

  const columns: ColumnsType<AddOnType> = [
    { title: 'Add-on Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit', render: (text) => <Text type="secondary">{text}</Text> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? '#16A34A' : 'default'}>
          {status}
        </Tag>
      )
    },
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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Add-Ons</Title>
          <Text type="secondary">Manage optional add-ons and extra features for your customers.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#16A34A' }}>
          Create Add-on
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table columns={columns} dataSource={mockData} pagination={false} />
      </Card>
    </div>
  );
};

export default AddOns;
