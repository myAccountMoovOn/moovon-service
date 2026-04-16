import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Descriptions, 
  Badge, 
  Table, 
  Button, 
  Space, 
  Spin, 
  Empty,
  Tag,
  Grid,
  List,
  Flex,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  RocketOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { useCustomer, useSubscriptions } from '../../hooks/useApi';
import dayjs from 'dayjs';
import type { Subscription } from '../../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const { data: customer, isLoading: custLoading } = useCustomer(id);
  const { data: subs, isLoading: subsLoading } = useSubscriptions({ page: 1, limit: 100, customerId: id });

  if (custLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" description="Loading customer profile..." />
      </div>
    );
  }

  if (!customer) {
    return <Empty description="Customer not found" />;
  }

  const subColumns = [
    {
      title: 'Service',
      dataIndex: 'service',
      render: (s: any) => s?.name || 'N/A',
    },
    {
      title: 'Valid From',
      dataIndex: 'startDate',
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Valid To',
      dataIndex: 'endDate',
      render: (date: string) => (
        <Space direction="horizontal">
          {dayjs(date).format('DD MMM YYYY')}
          {dayjs(date).isBefore(dayjs()) && <Badge status="error" text="Expired" />}
        </Space>
      ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        render: (amt: number) => `₹${amt.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const renderMobileProfile = () => (
    <div style={{ padding: '4px' }}>
      <Flex vertical gap={16}>
        <Flex align="center" gap={12}>
          <div style={{ background: 'var(--color-primary-bg)', padding: '10px', borderRadius: '10px' }}>
            <UserOutlined style={{ fontSize: '20px', color: 'var(--color-primary)' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>{customer.name}</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}><MailOutlined /> {customer.email}</Text>
          </div>
        </Flex>
        
        <Divider style={{ margin: '0' }} />
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 2 }}>PHONE</Text>
            <Text strong style={{ fontSize: '13px' }}><PhoneOutlined /> {customer.phone}</Text>
          </Col>
          <Col span={12}>
             <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 2 }}>STATUS</Text>
             <Badge 
                status={customer.isActive ? 'processing' : 'default'} 
                text={customer.isActive ? 'Active' : 'Inactive'} 
              />
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 2 }}>COMPANY</Text>
            <Text strong style={{ fontSize: '13px' }}><BankOutlined /> {customer.companyName || 'Individual'}</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 2 }}>GSTIN</Text>
            <Text strong style={{ fontSize: '13px' }}><AuditOutlined /> {customer.gstNumber || '-'}</Text>
          </Col>
        </Row>
      </Flex>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? 0 : '0 8px' }}>
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/customers')}
          type="text"
        >
          Back to Customers
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card 
            className="card-shadow" 
            title={!isMobile && (
              <Space direction="horizontal">
                <UserOutlined />
                <span>Personal Profile</span>
              </Space>
            )}
            styles={{ body: { padding: isMobile ? '16px' : '24px' } }}
          >
            {!isMobile ? (
              <Descriptions column={1} layout="vertical">
                <Descriptions.Item label="Full Name">
                  <Title level={5} style={{ margin: 0 }}>{customer.name}</Title>
                </Descriptions.Item>
                <Descriptions.Item label="Email Address">
                  <Text style={{ wordBreak: 'break-all' }}>{customer.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {customer.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Company">
                  {customer.companyName || <span style={{ color: '#ccc' }}>Not specified</span>}
                </Descriptions.Item>
                <Descriptions.Item label="GST Number">
                  <Text type="secondary">{customer.gstNumber || '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Account Status">
                  <Badge 
                    status={customer.isActive ? 'processing' : 'default'} 
                    text={customer.isActive ? 'Active' : 'Inactive'} 
                  />
                </Descriptions.Item>
              </Descriptions>
            ) : renderMobileProfile()}
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card 
             className="card-shadow"
             title={
               <Space direction="horizontal">
                 <FileTextOutlined />
                 <span>Subscription History</span>
               </Space>
             }
             styles={{ body: { padding: isMobile ? '0' : '24px' } }}
          >
            {!isMobile ? (
              <Table 
                columns={subColumns} 
                dataSource={subs?.data} 
                loading={subsLoading}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <List
                loading={subsLoading}
                dataSource={subs?.data}
                pagination={{ pageSize: 5, simple: true, style: { textAlign: 'center', margin: '16px 0' } }}
                renderItem={(item: Subscription) => (
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                    <Flex vertical gap={12}>
                      <Flex justify="space-between" align="center">
                        <Space direction="horizontal" size={8}>
                          <RocketOutlined style={{ color: 'var(--color-primary)' }} />
                          <Text strong style={{ fontSize: '15px' }}>{item.service?.name}</Text>
                        </Space>
                        <Tag color={item.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {item.paymentStatus.toUpperCase()}
                        </Tag>
                      </Flex>

                      <Flex justify="space-between" align="flex-end">
                        <Space direction="vertical" size={2}>
                          <Text type="secondary" style={{ fontSize: '10px' }}><CalendarOutlined /> DURATION</Text>
                          <Text style={{ fontSize: '12px' }}>
                            {dayjs(item.startDate).format('D MMM')} - {dayjs(item.endDate).format('D MMM YYYY')}
                          </Text>
                          {dayjs(item.endDate).isBefore(dayjs()) && (
                            <Tag color="error" style={{ fontSize: '10px', marginTop: 4 }}>EXPIRED</Tag>
                          )}
                        </Space>
                        <Space direction="vertical" size={2} style={{ textAlign: 'right' }}>
                          <Text type="secondary" style={{ fontSize: '10px' }}><DollarOutlined /> AMOUNT</Text>
                          <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>₹{item.amount.toLocaleString()}</Text>
                        </Space>
                      </Flex>
                    </Flex>
                  </div>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDetails;
