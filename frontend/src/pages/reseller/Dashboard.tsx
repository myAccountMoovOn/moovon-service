import React from 'react';
import { Row, Col, Card, Statistic, Typography, Table } from 'antd';
import { TeamOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ResellerDashboard: React.FC = () => {
  const recentClients = [
    { key: '1', name: 'Acme Corp', joined: '2026-09-01', status: 'Active' },
    { key: '2', name: 'Globex Inc', joined: '2026-08-25', status: 'Active' },
    { key: '3', name: 'Initech', joined: '2026-08-10', status: 'Pending' },
  ];

  const columns = [
    { title: 'Client Name', dataIndex: 'name', key: 'name' },
    { title: 'Joined Date', dataIndex: 'joined', key: 'joined' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Welcome back, Partner!</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Clients" value={12} prefix={<TeamOutlined />} valueStyle={{ color: '#16A34A' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Monthly Revenue" value={4500} prefix={<DollarOutlined />} valueStyle={{ color: '#16A34A' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Growth" value={15} suffix="%" prefix={<RiseOutlined />} valueStyle={{ color: '#16A34A' }} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Clients">
        <Table dataSource={recentClients} columns={columns} pagination={false} />
      </Card>
    </div>
  );
};

export default ResellerDashboard;
