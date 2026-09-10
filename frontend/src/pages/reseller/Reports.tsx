import React from 'react';
import { Card, Typography, Button, Table, Row, Col, Statistic, DatePicker, Progress, Space } from 'antd';
import { DownloadOutlined, DollarOutlined, UsergroupAddOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const PRIMARY_COLOR = '#16A34A';

const Reports: React.FC = () => {
  const revenueData = [
    { month: 'January', revenue: '$12,450', growth: '+5%' },
    { month: 'February', revenue: '$13,200', growth: '+6%' },
    { month: 'March', revenue: '$14,500', growth: '+9.8%' },
    { month: 'April', revenue: '$14,100', growth: '-2.7%' },
    { month: 'May', revenue: '$16,000', growth: '+13.4%' },
  ];

  const revenueColumns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (text: string) => <Text strong>{text}</Text> },
    { 
      title: 'Growth', 
      dataIndex: 'growth', 
      key: 'growth',
      render: (text: string) => (
        <Text type={text.startsWith('-') ? 'danger' : 'success'}>
          {text}
        </Text>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Reports & Analytics</Title>
          <Text type="secondary">Monitor your business performance and metrics.</Text>
        </div>
        <Space>
          <RangePicker />
          <Button type="primary" icon={<DownloadOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>
            Export
          </Button>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Total Revenue" value={145200} prefix="$" valueStyle={{ color: PRIMARY_COLOR }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Active Tenants" value={124} prefix={<UsergroupAddOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Churn Rate" value={2.4} suffix="%" valueStyle={{ color: '#cf1322' }} prefix={<FallOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Avg MRR / Tenant" value={350} prefix={<><RiseOutlined /> $</>} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card title="Revenue Trend" style={{ borderRadius: '12px', height: '100%' }}>
            <Table columns={revenueColumns} dataSource={revenueData} pagination={false} rowKey="month" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Tenant Distribution by Plan" style={{ borderRadius: '12px', height: '100%' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>Enterprise Plan</Text>
                <Text>45%</Text>
              </div>
              <Progress percent={45} strokeColor={PRIMARY_COLOR} showInfo={false} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>Professional Plan</Text>
                <Text>35%</Text>
              </div>
              <Progress percent={35} strokeColor="#1677ff" showInfo={false} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>Basic Plan</Text>
                <Text>20%</Text>
              </div>
              <Progress percent={20} strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
