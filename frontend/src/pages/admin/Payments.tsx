import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Card, 
  App,
  Empty,
  Popconfirm,
  Grid,
  List,
  Flex,
  Divider,
  Input,
  Radio,
  DatePicker,
  Drawer,
  Avatar,
  Alert
} from 'antd';
import { 
  CheckCircleFilled,
  DownloadOutlined, 
  SyncOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  TransactionOutlined,
  UserOutlined,
  RocketOutlined,
  FilePdfOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  RightOutlined,
  ClockCircleFilled
} from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDeletePayment, useAllPayments } from '../../hooks/useApi';
import axiosInstance from '../../api/axiosInstance';
import type { Payment } from '../../types';
import { PaymentRecordStatus } from '../../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const Payments: React.FC = () => {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const subId = searchParams.get('sub');
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<string>('all');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Detail View State (Mobile)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const deleteMutation = useDeletePayment();

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

  const { data, isLoading, refetch } = useAllPayments({
    page,
    limit: 10,
    search: search || subId || undefined,
    ...dateParams
  });

  const downloadInvoice = async (paymentId: string) => {
    try {
      const { data: res } = await axiosInstance.get(`/payments/invoice/${paymentId}`);
      window.open(res.data.url, '_blank');
    } catch (err) {
      message.error('Invoice not available yet');
    }
  };

  const openDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'paidAt',
      key: 'date',
      fixed: 'left' as const,
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
    },
    {
        title: 'Reference',
        key: 'reference',
        render: (_: any, record: Payment) => (
           <Space orientation="vertical" size={0}>
              <Text style={{ fontSize: '11px' }} type="secondary">TX: {record.transactionId || 'PENDING'}</Text>
              <Tag color="blue">{record.subscriptionId.split('-')[0].toUpperCase()}</Tag>
           </Space>
        )
    },
    {
      title: 'Customer/Service',
      key: 'details',
      responsive: ['md' as const],
      render: (_: any, record: Payment) => (
        <Space orientation="vertical" size={0}>
           <Text strong>{(record as any).subscription?.customer?.name}</Text>
           <Text style={{ fontSize: '12px' }} type="secondary">{(record as any).subscription?.service?.name}</Text>
        </Space>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (val: number) => <Text strong>₹{val.toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag 
          icon={status === PaymentRecordStatus.SUCCESS ? <CheckCircleFilled /> : <SyncOutlined spin={status === 'pending'} />} 
          color={status === PaymentRecordStatus.SUCCESS ? 'success' : 'processing'}
          style={{ borderRadius: '4px' }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: Payment) => (
        <Space>
           <Button icon={<DownloadOutlined />} size="small" onClick={() => downloadInvoice(record.id)}>Invoice</Button>
          <Popconfirm
            title="Delete Record?"
            onConfirm={async () => {
                try {
                    await deleteMutation.mutateAsync(record.id);
                    message.success('Deleted');
                    refetch();
                } catch (err) {
                    message.error('Delete failed');
                }
            }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? 0 : '0 16px' }}>
      <Flex 
        vertical={isMobile} 
        justify="space-between" 
        align={isMobile ? 'stretch' : 'center'} 
        style={{ marginBottom: 24, gap: 16 }}
      >
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px' }}>Payments & Invoices</Title>
        <Button icon={<SyncOutlined />} onClick={() => refetch()} size="large" block={isMobile}>Refresh List</Button>
      </Flex>

      <Card className="card-shadow" style={{ marginBottom: 24, borderRadius: '12px' }} styles={{ body: { padding: isMobile ? '16px' : '24px' } }}>
        <Flex vertical gap={16}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, alignItems: isMobile ? 'stretch' : 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Global Search</Text>
              <Input
                placeholder="TX ID, customer name or email..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                size="large"
                defaultValue={subId || ''}
              />
            </div>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Billed Within</Text>
              <Space orientation="horizontal" wrap={isMobile}>
                <Radio.Group value={period} onChange={e => setPeriod(e.target.value)} optionType="button" buttonStyle="solid" size="large">
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="today">Today</Radio.Button>
                  <Radio.Button value="week">Week</Radio.Button>
                  <Radio.Button value="month">Month</Radio.Button>
                  <Radio.Button value="custom">Custom</Radio.Button>
                </Radio.Group>
                {period === 'custom' && (
                  <Flex gap={8} style={{ width: isMobile ? '100%' : 'auto' }}>
                    <DatePicker 
                      placeholder="From"
                      value={customRange?.[0]}
                      onChange={(d) => d && setCustomRange([d, customRange?.[1] || d])}
                      style={{ flex: 1, border: 'none', boxShadow: 'none' }}
                      size="middle"
                    />
                    <Text type="secondary" style={{ padding: '0 4px', alignSelf: 'center' }}>→</Text>
                    <DatePicker 
                      placeholder="To"
                      value={customRange?.[1]}
                      onChange={(d) => d && setCustomRange([customRange?.[0] || d, d])}
                      style={{ flex: 1, border: 'none', boxShadow: 'none' }}
                      size="middle"
                    />
                  </Flex>
                )}
              </Space>
            </div>
          </div>
        </Flex>
      </Card>

      {subId && (
        <Alert
          message={
            <Space>
              <InfoCircleOutlined />
              <span>Filtering: <b>{subId}</b></span>
              <Button type="link" size="small" onClick={() => setSearchParams({})}>Clear</Button>
            </Space>
          }
          type="info"
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />
      )}

      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
              current: page,
              pageSize: 10,
              total: data?.meta?.total,
              onChange: (p) => setPage(p),
          }}
          rowKey="id"
          className="card-shadow"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      ) : (
        <List
          loading={isLoading}
          dataSource={data?.data}
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.meta?.total,
            onChange: (p) => setPage(p),
            simple: true,
            style: { textAlign: 'center', marginTop: 24 }
          }}
          renderItem={(item: Payment) => (
            <div 
                onClick={() => openDetails(item)}
                style={{ 
                    background: 'white', 
                    marginBottom: 12, 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer'
                }}
                className="card-shadow-sm"
            >
                <Flex align="center" justify="space-between">
                    <Flex align="center" gap={12}>
                        <Avatar 
                            style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
                            icon={<UserOutlined />}
                        />
                        <Space orientation="vertical" size={0}>
                            <Text strong style={{ fontSize: '15px' }}>{(item as any).subscription?.customer?.name}</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(item.paidAt).format('DD MMM')}</Text>
                        </Space>
                    </Flex>
                    <Flex vertical align="flex-end" gap={4}>
                        <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>₹{item.amount.toLocaleString()}</Text>
                        <Tag 
                            color={item.status === PaymentRecordStatus.SUCCESS ? 'success' : 'processing'} 
                            // size="small"
                            style={{ fontSize: '10px', margin: 0, borderRadius: '4px' }}
                        >
                            {item.status.toUpperCase()}
                        </Tag>
                    </Flex>
                </Flex>
            </div>
          )}
        />
      )}

      {/* Detail Drawer (Mobile) */}
      <Drawer
        title={<Text strong style={{ fontSize: '18px' }}>Payment Details</Text>}
        placement="bottom"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        height="85%"
        styles={{ body: { padding: '16px' }, header: { borderBottom: '1px solid #f0f0f0' } }}
        extra={<Button type="text" icon={<SyncOutlined />} onClick={() => refetch()} />}
      >
        {selectedPayment && (
            <Flex vertical gap={20}>
                <Card styles={{ body: { padding: '24px' } }} style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #f9fbff 100%)', border: 'none' }} className="card-shadow">
                    <Flex vertical gap={16}>
                        <Flex justify="space-between" align="center">
                            <Space orientation="vertical" size={2}>
                                <Text type="secondary" style={{ fontSize: '12px' }}><CalendarOutlined /> BILLED DATE</Text>
                                <Text strong style={{ fontSize: '16px' }}>{dayjs(selectedPayment.paidAt).format('MMMM D, YYYY')}</Text>
                            </Space>
                            <Tag color="success" icon={<CheckCircleFilled />} style={{ padding: '4px 12px', borderRadius: '8px' }}>PAID</Tag>
                        </Flex>

                        <Divider style={{ margin: '8px 0' }} />

                        <Flex vertical gap={12}>
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px' }}><UserOutlined /> CUSTOMER</Text>
                                <Title level={5} style={{ margin: '4px 0' }}>{(selectedPayment as any).subscription?.customer?.name}</Title>
                                <Text type="secondary">{(selectedPayment as any).subscription?.customer?.email}</Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px' }}><RocketOutlined /> SUBSCRIBED SERVICE</Text>
                                <Text strong style={{ display: 'block', marginTop: 4 }}>{(selectedPayment as any).subscription?.service?.name}</Text>
                            </div>
                        </Flex>

                        <div style={{ background: 'var(--color-primary-bg)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginTop: 8 }}>
                            <Text type="secondary" style={{ color: 'var(--color-primary)', fontSize: '14px' }}><DollarOutlined /> TOTAL AMOUNT</Text>
                            <Title level={2} style={{ margin: '4px 0', color: 'var(--color-primary)' }}>₹{selectedPayment.amount.toLocaleString()}</Title>
                        </div>

                        <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}><TransactionOutlined /> TRANSACTION ID</Text>
                            <Text style={{ display: 'block', fontSize: '13px', fontFamily: 'monospace', marginTop: 4 }}>{selectedPayment.transactionId || 'NOT_AVAILABLE'}</Text>
                        </div>
                    </Flex>
                </Card>

                <Flex vertical gap={12}>
                    {selectedPayment.status === PaymentRecordStatus.SUCCESS && (
                        <Button 
                            type="primary" 
                            size="large" 
                            icon={<FilePdfOutlined />} 
                            block 
                            onClick={() => downloadInvoice(selectedPayment.id)}
                            style={{ height: '54px', borderRadius: '12px', fontSize: '16px' }}
                        >
                            Download Invoice PDF
                        </Button>
                    )}
                    
                    <Popconfirm
                        title="Delete Payment Record"
                        description="This action cannot be undone."
                        onConfirm={async () => {
                            try {
                                await deleteMutation.mutateAsync(selectedPayment.id);
                                message.success('Deleted');
                                setIsDrawerOpen(false);
                                refetch();
                            } catch (err) {
                                message.error('Delete failed');
                            }
                        }}
                    >
                        <Button danger size="large" icon={<DeleteOutlined />} block style={{ height: '54px', borderRadius: '12px' }}>
                            Delete Permanently
                        </Button>
                    </Popconfirm>
                </Flex>
                
                <Alert
                   message="Verified Transaction"
                   description="This transaction has been successfully processed and verified by the master gateway."
                   type="success"
                   showIcon
                   icon={<CheckCircleFilled />}
                   style={{ borderRadius: '12px' }}
                />
            </Flex>
        )}
      </Drawer>
    </div>
  );
};

export default Payments;
