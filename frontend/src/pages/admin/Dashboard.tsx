import React, { useState, useMemo } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Spin, 
  Table, 
  Tag, 
  Space, 
  Radio, 
  DatePicker, 
  Input,
  Grid,
  Drawer,
  Flex,
  Avatar,
  Divider,
  Empty,
  Alert,
  Button
} from 'antd';
import {
  UserOutlined,
  FileSyncOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  InfoCircleOutlined,
  RocketOutlined,
  DoubleRightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  useDashboardSummary, 
  useCustomers, 
  useSubscriptions, 
  useAllPayments 
} from '../../hooks/useApi';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const AdminDashboard: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [period, setPeriod] = useState<string>('month');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [search, setSearch] = useState<string>('');
  const [activeMetric, setActiveMetric] = useState<string | null>('customers');

  // Date Range Logic
  const dateParams = useMemo(() => {
    let from: string | undefined;
    let to: string | undefined;
    
    const now = dayjs();
    
    if (period === 'today') {
      from = now.startOf('day').toISOString();
      to = now.endOf('day').toISOString();
    } else if (period === 'week') {
      from = now.startOf('week').toISOString();
      to = now.endOf('week').toISOString();
    } else if (period === 'month') {
      from = now.startOf('month').toISOString();
      to = now.endOf('month').toISOString();
    } else if (period === 'custom' && customRange) {
      from = customRange[0].startOf('day').toISOString();
      to = customRange[1].endOf('day').toISOString();
    }

    return { from, to };
  }, [period, customRange]);
  
  // Detail Drawer State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Main Summary Hook
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary(dateParams);

  // Detail Data Hooks
  const detailParams = { 
    page: 1, 
    limit: 10, 
    search, 
    ...dateParams 
  };

  const { data: pData, isLoading: pLoading } = useAllPayments(detailParams);
  const { data: cData, isLoading: cLoading } = useCustomers({
    ...detailParams, 
    hasSubscriptions: activeMetric === 'customers' ? true : undefined 
  });
  const { data: activeSubs, isLoading: asLoading } = useSubscriptions({...detailParams, status: 'active', from: undefined, to: undefined});
  const { data: expiredSubs, isLoading: esLoading } = useSubscriptions({...detailParams, status: 'expired', from: undefined, to: undefined});
  const { data: upcomingSubs, isLoading: usLoading } = useSubscriptions({...detailParams, status: 'upcoming', from: undefined, to: undefined});
  const { data: pendingSubs, isLoading: psLoading } = useSubscriptions({...detailParams, paymentStatus: 'pending'});

  if (summaryLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" description="Loading statistics..." />
      </div>
    );
  }

  const metrics = [
    { id: 'customers', title: "Total Customers", value: summary?.totalCustomers || 0, prefix: <UserOutlined />, color: 'var(--color-text-main)' },
    { id: 'active', title: "Total Active", value: summary?.activeSubscriptions || 0, prefix: <FileSyncOutlined />, color: 'var(--color-success)' },
    { id: 'expired', title: "Total Expired", value: summary?.expiredSubscriptions || 0, prefix: <ExclamationCircleOutlined />, color: '#ff4d4f' },
    { id: 'new_customers', title: "New Customer", value: summary?.newCustomers || 0, prefix: <RocketOutlined />, color: 'var(--color-primary)' },
    { id: 'upcoming', title: "Upcoming Renewable", value: summary?.upcomingRenewals || 0, prefix: <ClockCircleOutlined />, color: 'var(--color-warning)' },
    { id: 'expected', title: "Expected Revenue", value: summary?.expectedRevenue || 0, prefix: "₹", precision: 2, color: 'var(--color-warning)' },
    { id: 'revenue', title: "Total Revenue", value: summary?.totalRevenue || 0, prefix: "₹", precision: 2, color: 'var(--color-primary)' },
  ];

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const getMetricIcon = (metricId: string) => {
    switch (metricId) {
      case 'revenue': return <DollarOutlined />;
      case 'customers': return <UserOutlined />;
      case 'new_customers': return <RocketOutlined style={{ color: 'var(--color-primary)' }} />;
      case 'active': return <CheckCircleFilled style={{ color: 'var(--color-success)' }} />;
      case 'upcoming': return <ClockCircleFilled style={{ color: 'var(--color-warning)' }} />;
      case 'expected': return <ClockCircleOutlined style={{ color: 'var(--color-warning)' }} />;
      case 'expired': return <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />;
      default: return <InfoCircleOutlined />;
    }
  };

  const renderAdaptiveDetail = (loading: boolean, dataSource: any[], columns: any[], mobileRenderer: (item: any) => React.ReactNode) => {
    const safeData = Array.isArray(dataSource) ? dataSource : [];

    if (!isMobile) {
        return (
            <Table 
                loading={loading}
                dataSource={safeData} 
                rowKey="id"
                pagination={{ pageSize: 5 }}
                columns={columns}
                className="card-shadow-none"
            />
        );
    }

    return (
        <div style={{ marginTop: 8 }}>
            {safeData.slice(0, 10).map((item, index) => (
                <div 
                    key={item.id || index}
                    onClick={() => openDetails(item)}
                    style={{ 
                        background: 'white', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        marginBottom: 8, 
                        border: '1px solid #f0f0f0',
                        cursor: 'pointer'
                    }}
                    className="card-shadow-sm"
                >
                    {mobileRenderer(item)}
                </div>
            ))}
            {safeData.length === 0 && !loading && (
                <Empty description="No data found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </div>
    );
  };

  const renderDetailTable = () => {
    switch (activeMetric) {
      case 'revenue':
        return renderAdaptiveDetail(
            pLoading, 
            pData?.data || [], 
            [
              { title: 'Customer', dataIndex: ['subscription', 'customer', 'name'] },
              { title: 'Amount', dataIndex: 'amount', render: (val) => `₹${val}` },
              { title: 'Status', dataIndex: 'status', render: (val) => <Tag color="success">{(val || '').toUpperCase()}</Tag> }
            ],
            (item) => (
                <Flex justify="space-between" align="center">
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '14px' }}>{item.subscription?.customer?.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{item.subscription?.service?.name}</Text>
                    </Space>
                    <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>₹{(item.amount || 0).toLocaleString()}</Text>
                </Flex>
            )
        );
      case 'customers':
        return renderAdaptiveDetail(
            cLoading,
            cData?.data || [],
            [
              { title: 'Name', dataIndex: 'name' },
              { title: 'Phone', dataIndex: 'phone' },
              { title: 'Joined', dataIndex: 'createdAt', render: (val) => new Date(val).toLocaleDateString() }
            ],
            (item) => (
                <Flex justify="space-between" align="center">
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{item.email || 'No Email'}</Text>
                    </Space>
                    <DoubleRightOutlined style={{ color: 'var(--color-text-light)', fontSize: '12px' }} />
                </Flex>
            )
        );
      case 'new_customers':
        return renderAdaptiveDetail(
            cLoading,
            cData?.data || [],
            [
              { title: 'Name', dataIndex: 'name' },
              { title: 'Phone', dataIndex: 'phone' },
              { title: 'Joined', dataIndex: 'createdAt', render: (val) => new Date(val).toLocaleDateString() }
            ],
            (item) => (
                <Flex justify="space-between" align="center">
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{item.email || 'No Email'}</Text>
                    </Space>
                    <DoubleRightOutlined style={{ color: 'var(--color-text-light)', fontSize: '12px' }} />
                </Flex>
            )
        );
      case 'active':
      case 'expired':
      case 'upcoming':
      case 'expected':
        const currentData = activeMetric === 'active' ? activeSubs : (activeMetric === 'expired' ? expiredSubs : (activeMetric === 'upcoming' ? upcomingSubs : pendingSubs));
        const currentLoading = activeMetric === 'active' ? asLoading : (activeMetric === 'expired' ? esLoading : (activeMetric === 'upcoming' ? usLoading : psLoading));
        
        return renderAdaptiveDetail(
            currentLoading,
            currentData?.data || [],
            [
              { title: 'Customer', dataIndex: ['customer', 'name'] },
              { title: 'Service', dataIndex: ['service', 'name'] },
              { title: activeMetric === 'expired' ? 'Expired' : 'Ends', dataIndex: 'endDate', render: (val) => new Date(val).toLocaleDateString() }
            ],
            (item) => (
                <Flex justify="space-between" align="center">
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '14px' }}>{item.customer?.name}</Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>{item.service?.name}</Text>
                    </Space>
                    <Space orientation="vertical" align="end" size={0}>
                        {activeMetric === 'expired' ? (
                            <Tag color="error" style={{ margin: 0 }}>EXPIRED</Tag>
                        ) : (
                            <Text strong style={{ color: 'var(--color-success)' }}>{dayjs(item.endDate).format('DD MMM')}</Text>
                        )}
                    </Space>
                </Flex>
            )
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 16,
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 30px)' }}>System Overview</Title>
        <Flex vertical={isMobile} gap={10} align={isMobile ? 'stretch' : 'center'}>
          <Radio.Group 
            value={period} 
            onChange={e => setPeriod(e.target.value)}
            disabled={summaryLoading}
            optionType="button"
            buttonStyle="solid"
            size="middle"
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            <Radio.Button value="today" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>{isMobile ? 'Day' : 'Today'}</Radio.Button>
            <Radio.Button value="week" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>{isMobile ? 'Wk' : 'Week'}</Radio.Button>
            <Radio.Button value="month" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>{isMobile ? 'Mo' : 'Month'}</Radio.Button>
            <Radio.Button value="all" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>{isMobile ? 'All' : 'All'}</Radio.Button>
            <Radio.Button value="custom" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>{isMobile ? 'Fix' : 'Custom'}</Radio.Button>
          </Radio.Group>
          {period === 'custom' && (
            <Flex gap={8} style={{ width: isMobile ? '100%' : 'auto' }}>
              <DatePicker 
                placeholder="From"
                value={customRange?.[0]}
                onChange={(d) => setCustomRange([d, customRange?.[1]] as any)}
                style={{ flex: 1, borderRadius: '8px' }}
                size="middle"
              />
              <DatePicker 
                placeholder="To"
                value={customRange?.[1]}
                onChange={(d) => setCustomRange([customRange?.[0], d] as any)}
                style={{ flex: 1, borderRadius: '8px' }}
                size="middle"
              />
            </Flex>
          )}
        </Flex>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search by customer name, email or phone..."
          prefix={<SearchOutlined style={{ color: 'var(--color-text-light)' }} />}
          size="large"
          allowClear
          onChange={e => setSearch(e.target.value)}
          style={{ 
            maxWidth: 600, 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />
      </div>
      
      <Row gutter={[12, 12]} style={{ marginBottom: 32 }}>
        {metrics.map((item) => (
          <Col 
            key={item.id}
            xs={12} 
            sm={12} 
            lg={activeMetric === item.id ? 6 : 4}
            style={{ minWidth: 0 }}
          >
            <Card 
              hoverable
              className={`card-shadow ${activeMetric === item.id ? 'active-metric-card' : ''}`}
              style={{ 
                height: '100%', 
                cursor: 'pointer',
                border: activeMetric === item.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                transition: 'all 0.3s',
                backgroundColor: activeMetric === item.id ? 'rgba(var(--color-primary-rgb), 0.02)' : '#fff',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              styles={{ body: { padding: isMobile ? '12px 10px' : '20px 24px' } }}
              onClick={() => setActiveMetric(item.id)}
            >
              <Statistic
                title={<span style={{ fontWeight: 500, color: 'var(--color-text-secondary)', fontSize: isMobile ? '11px' : '14px' }}>{item.title}</span>}
                value={item.value}
                prefix={<span style={{ fontSize: isMobile ? '14px' : '20px' }}>{item.prefix}</span>}
                precision={item.precision}
                styles={{ content: { color: item.color, fontWeight: 700, fontSize: isMobile ? '18px' : '24px' } }}
              />
              {!isMobile && (
                <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                    {activeMetric === item.id ? 'Current View' : 'Click to drill-down'} <ArrowRightOutlined style={{ fontSize: '10px' }} />
                    </Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        className="card-shadow" 
        style={{ borderRadius: '12px', border: 'none' }}
        styles={{ body: { padding: isMobile ? '8px 10px' : '24px' }, header: { borderBottom: '1px solid #f0f0f0', padding: isMobile ? '8px 12px' : '16px 24px', minHeight: 'auto' } }}
        title={
          <Flex gap={8} align="center">
            {getMetricIcon(activeMetric || '')}
            <Text strong style={{ fontSize: isMobile ? '13px' : '16px' }}>
              {metrics.find(m => m.id === activeMetric)?.title} Data
            </Text>
            {dateParams.from && (
              <Tag color="blue" style={{ borderRadius: '4px', margin: 0, fontSize: '10px' }}>
                {dayjs(dateParams.from).format('DD MMM')}
              </Tag>
            )}
          </Flex>
        }
      >
        {renderDetailTable()}
      </Card>

      {/* Audit Drawer (Mobile Only) */}
      <Drawer
        title={
            <Flex align="center" gap={12}>
                <Avatar 
                    style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
                    icon={getMetricIcon(activeMetric || '')}
                />
                <div>
                    <Text strong style={{ display: 'block' }}>Record Audit</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>System Metadata & Context</Text>
                </div>
            </Flex>
        }
        placement="bottom"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '24px', paddingBottom: '40px' }, header: { borderBottom: '1px solid #f0f0f0' } }}
      >
        {selectedItem && (
            <Flex vertical gap={24}>
                {activeMetric === 'revenue' && (
                    <>
                        <Flex vertical gap={4}>
                            <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Financial Transaction</Text>
                            <Title level={3} style={{ margin: 0 }}>₹{(selectedItem.amount || 0).toLocaleString()}</Title>
                            <Tag color="success" style={{ width: 'fit-content' }}>COMPLETED</Tag>
                        </Flex>
                        
                        <Divider style={{ margin: 0 }} />
                        
                        <Flex vertical gap={16}>
                            <Flex justify="space-between">
                                <Text type="secondary">Customer</Text>
                                <Text strong>{selectedItem.subscription?.customer?.name}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Service</Text>
                                <Text strong>{selectedItem.subscription?.service?.name}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Processed On</Text>
                                <Text strong>{dayjs(selectedItem.paidAt).format('DD MMM YYYY, HH:mm')}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">TX ID</Text>
                                <Text code style={{ fontSize: '10px' }}>{selectedItem.transactionId || 'MANUAL'}</Text>
                            </Flex>
                        </Flex>
                    </>
                )}

                {(activeMetric === 'customers' || activeMetric === 'new_customers') && (
                     <>
                        <Flex vertical gap={4}>
                            <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Customer Profile</Text>
                            <Title level={3} style={{ margin: 0 }}>{selectedItem.name}</Title>
                            <Text type="secondary">{selectedItem.email || 'No Email provided'}</Text>
                        </Flex>
                        
                        <Divider style={{ margin: 0 }} />
                        
                        <Flex vertical gap={16}>
                            <Flex justify="space-between">
                                <Text type="secondary">Phone Number</Text>
                                <Text strong>{selectedItem.phone || 'N/A'}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Joined System</Text>
                                <Text strong>{dayjs(selectedItem.createdAt).format('DD MMM YYYY')}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Active Subs</Text>
                                <Tag color="blue">{selectedItem.subscriptionsCount || 0}</Tag>
                            </Flex>
                        </Flex>
                    </>
                )}

                {(activeMetric === 'active' || activeMetric === 'expired' || activeMetric === 'upcoming' || activeMetric === 'expected') && (
                     <>
                        <Flex vertical gap={4}>
                            <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Subscription Audit</Text>
                            <Title level={4} style={{ margin: 0 }}>{selectedItem.service?.name}</Title>
                            <Text strong color="var(--color-primary)">{selectedItem.customer?.name}</Text>
                        </Flex>
                        
                        <Divider style={{ margin: 0 }} />
                        
                        <Flex vertical gap={16}>
                            <Flex justify="space-between">
                                <Text type="secondary">Current Status</Text>
                                <Tag color={new Date(selectedItem.endDate) < new Date() ? 'error' : 'success'}>
                                    {new Date(selectedItem.endDate) < new Date() ? 'EXPIRED' : 'ACTIVE'}
                                </Tag>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Cycle Frequency</Text>
                                <Text strong>{selectedItem.service?.durationType?.toUpperCase()}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">Expiry Date</Text>
                                <Text strong style={{ color: 'var(--color-primary)' }}>{dayjs(selectedItem.endDate).format('DD MMM YYYY')}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text type="secondary">System ID</Text>
                                <Text code style={{ fontSize: '10px' }}>{selectedItem.id.slice(0, 8)}...</Text>
                            </Flex>
                        </Flex>
                        
                        <Alert 
                            title="Action Required"
                            description="Audit this record to ensure billing cycle integrity and customer satisfaction."
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            style={{ borderRadius: '12px' }}
                        />
                    </>
                )}

                <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => setIsDrawerOpen(false)}
                    style={{ borderRadius: '10px', marginTop: 8 }}
                >
                    Acknowledge & Close
                </Button>
            </Flex>
        )}
      </Drawer>
    </div>
  );
};

export default AdminDashboard;
