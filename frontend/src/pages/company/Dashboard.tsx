import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Space, Progress } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  BgColorsOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const recentTransactions = [
    { id: '1', client: 'Rahul Sharma', service: 'Annual Maintenance Contract', amount: '₹ 4,999', status: 'PAID', date: '2026-09-09' },
    { id: '2', client: 'Priya Desai', service: 'Premium Installation Service', amount: '₹ 1,500', status: 'PAID', date: '2026-09-08' },
    { id: '3', client: 'Sunshine Retail Pvt Ltd', service: 'Bulk Office Supplies', amount: '₹ 38,000', status: 'PENDING', date: '2026-09-07' },
    { id: '4', client: 'Amit Patel', service: 'Home Router Setup', amount: '₹ 999', status: 'PAID', date: '2026-09-05' },
  ];

  const columns = [
    { title: 'Customer Name', dataIndex: 'client', key: 'client', render: (val: string) => <Text strong>{val}</Text> },
    { title: 'Product / Service', dataIndex: 'service', key: 'service' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: string) => <Text strong style={{ color: '#0F172A' }}>{val}</Text> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PAID' ? 'success' : 'warning'}>
          {status}
        </Tag>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (val: string) => <Text type="secondary" style={{ fontSize: '13px' }}>{val}</Text> },
  ];

  return (
    <div>
      {/* Header Welcome Banner */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: '0 0 4px 0', color: '#071A3D' }}>
              Company Dashboard
            </Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              Welcome back, <strong>{user?.email}</strong>. Manage your company operations, clients, and services.
            </Text>
          </div>

          <Space wrap>
            <Button
              icon={<BgColorsOutlined />}
              onClick={() => navigate('/company/brand-settings')}
              style={{ borderRadius: 8, height: 42 }}
            >
              White-Label Settings
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/company/services')}
              style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', borderRadius: 8, height: 42, fontWeight: 600 }}
            >
              Add New Service
            </Button>
          </Space>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="card-shadow" style={{ borderRadius: 12, borderLeft: '4px solid #1468E8' }}>
            <Statistic
              title="Total Revenue"
              value="₹ 1,37,498"
              prefix={<CreditCardOutlined style={{ color: '#1468E8' }} />}
              suffix={<Text type="success" style={{ fontSize: '12px' }}><ArrowUpOutlined /> +14%</Text>}
              styles={{ content: { color: '#071A3D', fontWeight: 800, fontSize: '24px' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-shadow" style={{ borderRadius: 12, borderLeft: '4px solid #10B981' }}>
            <Statistic
              title="Active Clients & Customers"
              value={142}
              prefix={<TeamOutlined style={{ color: '#10B981' }} />}
              styles={{ content: { color: '#071A3D', fontWeight: 800, fontSize: '24px' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-shadow" style={{ borderRadius: 12, borderLeft: '4px solid #6366F1' }}>
            <Statistic
              title="Active Services"
              value={18}
              prefix={<AppstoreOutlined style={{ color: '#6366F1' }} />}
              styles={{ content: { color: '#071A3D', fontWeight: 800, fontSize: '24px' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="card-shadow" style={{ borderRadius: 12, borderLeft: '4px solid #F59E0B' }}>
            <Statistic
              title="Active Subscriptions"
              value={96}
              prefix={<BankOutlined style={{ color: '#F59E0B' }} />}
              styles={{ content: { color: '#071A3D', fontWeight: 800, fontSize: '24px' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Recent Activity & Subscriptions */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Recent Transactions & Invoices</span>
                <Button type="link" onClick={() => navigate('/company/payments')} style={{ padding: 0, color: '#1468E8' }}>
                  View All
                </Button>
              </div>
            }
            className="card-shadow"
            style={{ borderRadius: 12 }}
          >
            <Table
              columns={columns}
              dataSource={recentTransactions}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Right Column: Company Resource Allocation & Shortcuts */}
        <Col xs={24} lg={8}>
          <Card title="Workspace Quota & Health" className="card-shadow" style={{ borderRadius: 12, marginBottom: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <Text>User Seats (142 / 200)</Text>
                <Text strong>71%</Text>
              </div>
              <Progress percent={71} strokeColor="#1468E8" showInfo={false} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <Text>Monthly Storage Usage</Text>
                <Text strong>42%</Text>
              </div>
              <Progress percent={42} strokeColor="#10B981" showInfo={false} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 4 }}>
                <Text>API Rate Limit</Text>
                <Text strong>18%</Text>
              </div>
              <Progress percent={18} strokeColor="#6366F1" showInfo={false} />
            </div>
          </Card>

          <Card title="Quick Management Links" className="card-shadow" style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<TeamOutlined />} onClick={() => navigate('/company/customers')} style={{ textAlign: 'left', height: 40 }}>
                Manage Customers & Clients
              </Button>
              <Button block icon={<FileTextOutlined />} onClick={() => navigate('/company/reports')} style={{ textAlign: 'left', height: 40 }}>
                Download Sales Reports
              </Button>
              <Button block icon={<BgColorsOutlined />} onClick={() => navigate('/company/brand-settings')} style={{ textAlign: 'left', height: 40 }}>
                Customize Company Logo & Domain
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyDashboard;
