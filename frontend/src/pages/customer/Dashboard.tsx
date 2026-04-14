import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Tag, Space, Empty, Button, App, Grid, List, Modal, Descriptions, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useSubscriptions } from '../../hooks/useApi';
import { generatePaymentLink } from '../../api/paymentApi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CustomerDashboard: React.FC = () => {
  const { message } = App.useApp();
  const { data, isLoading, refetch } = useSubscriptions({ page: 1, limit: 10 });
  const [generatingForId, setGeneratingForId] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  // Refetch when window regains focus (e.g. after returning from payment page)
  React.useEffect(() => {
    const handleFocus = () => refetch();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handlePayment = async (subId: string) => {
    setGeneratingForId(subId);
    try {
      const { paymentLinkUrl } = await generatePaymentLink(subId);
      message.success('Redirecting to secure payment page...');
      setTimeout(() => {
        window.location.href = paymentLinkUrl;
      }, 800);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to generate payment link');
      setGeneratingForId(null);
    }
  };

  const getNextBillingDate = (sub: any) => {
    if (sub.endDate) return dayjs(sub.endDate);
    const start = dayjs(sub.startDate);
    const now = dayjs();
    let nextDate = start;
    while (nextDate.isBefore(now, 'day')) {
      nextDate = nextDate.add(1, 'month');
    }
    return nextDate;
  };

  const activeCount = data?.data.filter(s => !s.endDate || dayjs(s.endDate).isAfter(dayjs())).length || 0;

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service',
      render: (s: any) => <Text strong>{s?.name}</Text>,
    },
    {
      title: 'Billing / Expiry',
      key: 'expiry',
      render: (_: any, record: any) => {
        if (!record.endDate) {
          return (
            <Space direction="vertical" size={0}>
              <Text strong style={{ color: 'var(--color-primary)' }}>Ongoing (Monthly)</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>Next: {getNextBillingDate(record).format('MMM D, YYYY')}</Text>
            </Space>
          );
        }
        return (
          <Space>
             <Text strong>{dayjs(record.endDate).format('MMM D, YYYY')}</Text>
             {dayjs(record.endDate).diff(dayjs(), 'day') <= 7 && <Tag color="warning">Renew Soon</Tag>}
          </Space>
        );
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (val: number) => `₹ ${Number(val).toLocaleString()}`,
    },
    {
        title: 'Status',
        key: 'status',
        render: (_: any, record: any) => {
          const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
          const isPaid = record.paymentStatus === 'paid';
          return (
            <Space>
              {isActive ? <Tag color="success">ACTIVE</Tag> : <Tag color="error">EXPIRED</Tag>}
              {isPaid ? <Tag color="success">PAID</Tag> : <Tag color="warning">PAYMENT PENDING</Tag>}
            </Space>
          );
        }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        record.paymentStatus !== 'paid' ? (
          <Button 
            type="primary" 
            size="small" 
            loading={generatingForId === record.id}
            onClick={() => handlePayment(record.id)}
          >
            Pay Now
          </Button>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="processing">Service Active</Tag>
        )
      )
    }
  ];

  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs;

  const nextRenewal = data?.data
    .filter((s: any) => !s.endDate || dayjs(s.endDate).isAfter(dayjs()))
    .map((s: any) => getNextBillingDate(s))
    .sort((a: any, b: any) => a.valueOf() - b.valueOf())[0];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={3}>Welcome back!</Title>
        <Text type="secondary">Here is an overview of your active services and subscriptions.</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12}>
          <Card className="card-shadow" style={{ borderLeft: '4px solid var(--color-success)' }}>
            <Statistic 
                title="Active Services" 
                value={activeCount} 
                prefix={<CheckCircleOutlined />} 
                styles={{ content: { color: 'var(--color-success)', fontWeight: 700, fontSize: isMobile ? '20px' : '24px' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="card-shadow" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <Statistic 
                title="Nearest Payment/Renewal" 
                value={nextRenewal ? nextRenewal.format('MMM D, YYYY') : 'N/A'} 
                prefix={<ClockCircleOutlined />} 
                styles={{ content: { color: 'var(--color-primary)', fontWeight: 700, fontSize: isMobile ? '20px' : '24px' } }}
            />
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginBottom: 16 }}>My Subscriptions</Title>
      
      {isMobile ? (
        <List
          dataSource={data?.data}
          loading={isLoading}
          renderItem={(record) => {
            const isActive = !record.endDate || dayjs(record.endDate).isAfter(dayjs());
            const isPaid = record.paymentStatus === 'paid';
            
            return (
              <Card 
                className="card-shadow" 
                size="small"
                style={{ marginBottom: 12, borderRadius: 8 }}
                onClick={() => setSelectedSub(record)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '15px' }}>{record.service?.name}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={isActive ? 'success' : 'error'} style={{ fontSize: '10px', lineHeight: '16px' }}>
                        {isActive ? 'ACTIVE' : 'EXPIRED'}
                      </Tag>
                      <Text strong style={{ fontSize: '13px', marginLeft: 8 }}>₹ {Number(record.amount).toLocaleString()}</Text>
                    </div>
                  </div>
                  <Space>
                    {record.paymentStatus !== 'paid' && (
                      <Button 
                        type="primary" 
                        size="small" 
                        loading={generatingForId === record.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePayment(record.id);
                        }}
                      >
                        Pay
                      </Button>
                    )}
                    <Button type="text" icon={<ArrowRightOutlined />} />
                  </Space>
                </div>
              </Card>
            );
          }}
          locale={{ emptyText: <Empty description="You don't have any active subscriptions yet." /> }}
        />
      ) : (
        <Table 
          columns={columns} 
          dataSource={data?.data} 
          loading={isLoading} 
          rowKey="id"
          pagination={false}
          className="custom-table"
          locale={{ emptyText: <Empty description="You don't have any active subscriptions yet." /> }}
        />
      )}

      <Modal
        title="Subscription Details"
        open={!!selectedSub}
        onCancel={() => setSelectedSub(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedSub(null)}>Close</Button>,
          selectedSub?.paymentStatus !== 'paid' && (
            <Button 
              key="pay" 
              type="primary" 
              loading={generatingForId === selectedSub?.id}
              onClick={() => handlePayment(selectedSub.id)}
            >
              Pay Now
            </Button>
          )
        ]}
      >
        {selectedSub && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Service">{selectedSub.service?.name}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  <Tag color={(!selectedSub.endDate || dayjs(selectedSub.endDate).isAfter(dayjs())) ? 'success' : 'error'}>
                    {(!selectedSub.endDate || dayjs(selectedSub.endDate).isAfter(dayjs())) ? 'ACTIVE' : 'EXPIRED'}
                  </Tag>
                  <Tag color={selectedSub.paymentStatus === 'paid' ? 'success' : 'warning'}>
                    {selectedSub.paymentStatus.toUpperCase()}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">₹ {Number(selectedSub.amount).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Start Date">{dayjs(selectedSub.startDate).format('MMM D, YYYY')}</Descriptions.Item>
              <Descriptions.Item label="End Date">
                {selectedSub.endDate ? dayjs(selectedSub.endDate).format('MMM D, YYYY') : 'Ongoing (Monthly)'}
              </Descriptions.Item>
              <Descriptions.Item label="Next Billing">
                {getNextBillingDate(selectedSub).format('MMM D, YYYY')}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedSub.notes && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Notes:</Text>
                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: 4, marginTop: 4 }}>
                  {selectedSub.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
