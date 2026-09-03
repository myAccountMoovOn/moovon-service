import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  InputNumber, 
  Tooltip,
  App,
  Popconfirm,
  Grid,
  Card,
  List,
  Flex,
  Divider,
  Input,
  Radio,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  SendOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  DeleteOutlined,
  FilterOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  RocketOutlined,
  SearchOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  useSubscriptions, 
  useCustomers, 
  useServices, 
  useDeleteSubscription,
  usePackages,
  useValidateCoupon
} from '../../hooks/useApi';
import type { Subscription, Package, Coupon } from '../../types';
import { NotificationChannel, PaymentStatus } from '../../types';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const Subscriptions: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentFilter, setPaymentFilter] = useState<string | undefined>();
  const [serviceFilter, setServiceFilter] = useState<string | undefined>();
  const [period, setPeriod] = useState<string>('all');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const selectedServiceId = Form.useWatch('serviceId', form);
  const selectedPackageId = Form.useWatch('packageId', form);
  
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date Logic for Expiry Filter
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

  const { data, isLoading, refetch } = useSubscriptions({ 
    page, 
    limit: 10, 
    status: statusFilter,
    paymentStatus: paymentFilter,
    serviceId: serviceFilter,
    search,
    ...dateParams
  });

  const { data: customersList } = useCustomers({ page: 1, limit: 1000 });
  const { data: servicesList } = useServices({ page: 1, limit: 1000 });
  const { data: packagesList } = usePackages({ serviceId: selectedServiceId });
  const deleteMutation = useDeleteSubscription();
  const validateCouponMutation = useValidateCoupon();

  // Handling Package Selection logic
  React.useEffect(() => {
    if (selectedPackageId && packagesList) {
      const pkg = packagesList.find(p => p.id === selectedPackageId);
      if (pkg) {
        form.setFieldsValue({ 
          amount: pkg.offerPrice,
          // Calculate end date based on duration
          endDate: dayjs().add(pkg.durationMonths, 'month')
        });
      }
    }
  }, [selectedPackageId, packagesList, form]);

  const handleApplyCoupon = async () => {
    const code = form.getFieldValue('couponCode');
    const amount = form.getFieldValue('amount');
    
    if (!code) return message.warning('Please enter a coupon code');
    if (!amount) return message.warning('Please select a service/package first');

    setCouponLoading(true);
    try {
      const result = await validateCouponMutation.mutateAsync({ code, amount });
      setAppliedCoupon(result);
      form.setFieldsValue({ amount: result.finalAmount });
      message.success(`Coupon applied! You saved ₹${result.discountAmount}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const getStatusTag = (sub: Subscription) => {
    if (!sub.endDate) {
      return <Tag color="processing" icon={<CheckCircleOutlined />}>ONGOING</Tag>;
    }

    const today = dayjs();
    const expiry = dayjs(sub.endDate);
    
    if (expiry.isBefore(today)) {
      return <Tag color="error" icon={<ExclamationCircleOutlined />}>EXPIRED</Tag>;
    }
    if (expiry.diff(today, 'day') <= 7) {
      return <Tag color="warning" icon={<ClockCircleOutlined />}>EXPIRING SOON</Tag>;
    }
    return <Tag color="success" icon={<CheckCircleOutlined />}>ACTIVE</Tag>;
  };

  const handleCreate = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { couponCode, notificationEmail, notificationSms, notificationWhatsapp, ...cleanedValues } = values;
      
      // 1. Update customer preferences
      await axiosInstance.patch(`/customers/${values.customerId}`, {
        notificationEmail,
        notificationSms,
        notificationWhatsapp,
      });

      // 2. Create subscription
      const payload = {
        ...cleanedValues,
        couponId: appliedCoupon?.couponId || null,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      };
      
      await axiosInstance.post('/subscriptions', payload);
      message.success('Subscription assigned and payment link sent to customer!');
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err) {
      message.error('Assignment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const notifyUser = async (id: string) => {
    try {
      await axiosInstance.post(`/subscriptions/${id}/notify`, { channels: [NotificationChannel.EMAIL, NotificationChannel.SMS] });
      message.success('Notifications queued');
    } catch (err) {
      message.error('Failed to queue notifications');
    }
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      fixed: 'left' as const,
      render: (c: any) => (
        <Flex vertical gap={0}>
          <Text strong>{c?.name || '-'}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{c?.email}</Text>
        </Flex>
      ),
    },
    {
      title: 'Product / Service',
      key: 'service',
      render: (_: any, record: Subscription) => record.service?.name || record.package?.name || '-',
    },
    {
      title: 'Period',
      key: 'period',
      responsive: ['md' as const],
      render: (_: any, record: Subscription) => (
        <Text style={{ fontSize: '13px' }}>
          {dayjs(record.startDate).format('MMM D, YYYY')} - {record.endDate ? dayjs(record.endDate).format('MMM D, YYYY') : 'Ongoing'}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (val: number) => <Text strong>₹{val.toLocaleString()}</Text>,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (status: string) => (
        <Tag color={status === PaymentStatus.PAID ? 'green' : 'orange'} style={{ borderRadius: '4px' }}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      responsive: ['sm' as const],
      render: (_: any, record: Subscription) => getStatusTag(record),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: Subscription) => (
        <Flex gap={12} align="center">
          <Tooltip title="Send Notifications">
            <Button icon={<SendOutlined />} size="small" onClick={() => notifyUser(record.id)} />
          </Tooltip>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => window.location.href=`/admin/payments?sub=${record.id}`}
          >
            Bill
          </Button>
          <Popconfirm
            title="Delete Subscription"
            description="Remove this subscription?"
            onConfirm={async () => {
                try {
                    await deleteMutation.mutateAsync(record.id);
                    message.success('Deleted');
                    refetch();
                } catch (err: any) {
                    message.error('Delete failed');
                }
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
            />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '0' : '0 8px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: 16,
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? '24px' : '30px' }}>Subscriptions</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          block={isMobile}
          size="large"
          style={{ height: isMobile ? '45px' : '40px' }}
        >
          Assign Service
        </Button>
      </div>

      <Card className="card-shadow" style={{ marginBottom: 16, borderRadius: '12px' }} styles={{ body: { padding: isMobile ? '12px' : '24px' } }}>
        <Flex vertical gap={16}>
           {/* Row 1: Search and Main Filters */}
            <Flex vertical={isMobile} gap={10} align={isMobile ? 'stretch' : 'center'} style={{ width: '100%' }}>
               <Input
                 placeholder="Search customers or services..."
                 prefix={<SearchOutlined style={{ color: 'var(--color-primary)' }} />}
                 onChange={(e) => setSearch(e.target.value)}
                 allowClear
                 style={{ flex: 1, borderRadius: '8px' }}
               />
               <Flex gap={8} wrap={isMobile} style={{ width: isMobile ? '100%' : 'auto' }}>
                 <Select 
                   placeholder="All Subs" 
                   style={{ width: isMobile ? 'calc(33% - 6px)' : 110 }} 
                   allowClear 
                   onChange={(val) => setStatusFilter(val)}
                   options={[
                     { label: 'Active', value: 'active' },
                     { label: 'Soon', value: 'upcoming' },
                     { label: 'Expired', value: 'expired' },
                   ]}
                 />
                 <Select 
                   placeholder="Payment" 
                   style={{ width: isMobile ? 'calc(33% - 6px)' : 110 }} 
                   allowClear 
                   onChange={(val) => setPaymentFilter(val)}
                   options={[
                     { label: 'Paid', value: 'paid' },
                     { label: 'Pending', value: 'pending' },
                   ]}
                 />
                 <Select 
                   placeholder="Service" 
                   style={{ width: isMobile ? 'calc(34% - 6px)' : 150 }} 
                   allowClear 
                   onChange={(val) => setServiceFilter(val)}
                   showSearch
                   optionFilterProp="label"
                   options={servicesList?.data.map((s: any) => ({ label: s.name, value: s.id }))}
                 />
               </Flex>
            </Flex>

           {/* Row 2: Expiry Period Filter */}
           <Flex vertical gap={4}>
              {!isMobile && <Text type="secondary" style={{ display: 'block', fontSize: '11px', fontWeight: 600 }}>EXPIRY WITHIN</Text>}
              <Flex vertical={isMobile} gap={10} align={isMobile ? 'stretch' : 'center'}>
                <Radio.Group 
                  value={period} 
                  onChange={e => setPeriod(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  size="middle"
                  style={{ width: isMobile ? '100%' : 'auto' }}
                >
                  <Radio.Button value="all" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>All</Radio.Button>
                  <Radio.Button value="today" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>Day</Radio.Button>
                  <Radio.Button value="week" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>Wk</Radio.Button>
                  <Radio.Button value="month" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>Mo</Radio.Button>
                  <Radio.Button value="custom" style={{ width: isMobile ? '20%' : 'auto', textAlign: 'center' }}>Fix</Radio.Button>
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
           </Flex>
        </Flex>
      </Card>

      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
              current: page,
              pageSize: 10,
              total: data?.total,
              onChange: (p) => setPage(p),
          }}
          rowKey="id"
          className="card-shadow"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
      ) : (
        <Flex vertical gap={12} style={{ paddingBottom: 80 }}>
          {Array.isArray(data?.data) && data.data.map((item: Subscription) => (
            <Card 
              key={item.id}
              style={{ borderRadius: '12px' }} 
              className="card-shadow"
              styles={{ body: { padding: '6px 12px' } }}
            >
              <Flex vertical gap={8}>
                <Flex justify="space-between" align="flex-start">
                  <Flex vertical gap={0}>
                    <Text strong style={{ fontSize: '14px' }}><UserOutlined /> {item.customer?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{item.customer?.email}</Text>
                  </Flex>
                  {getStatusTag(item)}
                </Flex>

                <Divider style={{ margin: '8px 0' }} />

                <Flex justify="space-between" align="center">
                  <Flex vertical gap={2}>
                    <Text type="secondary" style={{ fontSize: '11px' }}><RocketOutlined /> PRODUCT / SERVICE</Text>
                    <Text strong>{item.service?.name || item.package?.name || '-'}</Text>
                  </Flex>
                  <Flex vertical gap={2} style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}><DollarOutlined /> AMOUNT</Text>
                    <Text strong style={{ color: 'var(--color-primary)' }}>₹{item.amount.toLocaleString()}</Text>
                  </Flex>
                </Flex>

                <Flex justify="space-between" align="center" style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: '8px' }}>
                  <Flex vertical gap={0}>
                    <Text type="secondary" style={{ fontSize: '10px' }}><CalendarOutlined /> PERIOD</Text>
                    <Text style={{ fontSize: '11px' }}>
                      {dayjs(item.startDate).format('MMM D, YYYY')} - {item.endDate ? dayjs(item.endDate).format('MMM D, YYYY') : 'Ongoing'}
                    </Text>
                  </Flex>
                  <Tag color={item.paymentStatus === 'paid' ? 'green' : 'orange'} icon={<CreditCardOutlined />} style={{ margin: 0 }}>
                    {item.paymentStatus.toUpperCase()}
                  </Tag>
                </Flex>

                <Flex gap={8} style={{ marginTop: 4 }}>
                  <Button 
                    type="primary" 
                    icon={<DollarOutlined />} 
                    onClick={() => window.location.href=`/admin/payments?sub=${item.id}`}
                    style={{ flex: 1, borderRadius: '8px' }}
                  >
                    Pay Bill
                  </Button>
                  <Button 
                    icon={<SendOutlined />} 
                    onClick={() => notifyUser(item.id)}
                    style={{ borderRadius: '8px' }}
                  />
                  <Popconfirm
                    title="Delete Subscription"
                    onConfirm={async () => {
                      try {
                        await deleteMutation.mutateAsync(item.id);
                        message.success('Deleted');
                        refetch();
                      } catch (err) {
                        message.error('Delete failed');
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button icon={<DeleteOutlined />} danger style={{ borderRadius: '8px' }} />
                  </Popconfirm>
                </Flex>
              </Flex>
            </Card>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: 16 }}>
             <Radio.Group 
                value={page} 
                onChange={e => setPage(e.target.value)}
                size="small"
             >
                {Array.from({ length: Math.ceil((data?.total || 0) / 10) }, (_, i) => (
                   <Radio.Button key={i + 1} value={i + 1}>{i + 1}</Radio.Button>
                ))}
             </Radio.Group>
          </div>
        </Flex>
      )}

      <Modal
        title={
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: '18px' }}>Assign Service</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>Assign a new service to an existing customer</Text>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={isMobile ? '100%' : 550}
        style={{ top: isMobile ? 10 : 100 }}
        styles={{ body: { paddingTop: 16 } }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="customerId" label="Customer" rules={[{ required: true, message: 'Select a customer' }]}>
            <Select 
              showSearch 
              optionFilterProp="children" 
              placeholder="Search customer name or email" 
              size="large"
              onChange={async (id) => {
                try {
                  const { data } = await axiosInstance.get(`/customers/${id}`);
                  const customer = data.data;
                  form.setFieldsValue({
                    notificationEmail: customer.notificationEmail !== false,
                    notificationSms: customer.notificationSms !== false,
                    notificationWhatsapp: customer.notificationWhatsapp !== false,
                  });
                } catch (err) {
                  // Fallback to default true if fetch fails
                  form.setFieldsValue({
                    notificationEmail: true,
                    notificationSms: true,
                    notificationWhatsapp: true,
                  });
                }
              }}
            >
              {customersList?.data.map((c: any) => (
                <Option key={c.id} value={c.id}>{c.name} ({c.email})</Option>
              ))}
            </Select>
          </Form.Item>

          <Flex gap={16} vertical={isMobile}>
            <Form.Item 
              name="serviceId" 
              label="Product / Service (Optional)" 
              dependencies={['packageId']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value && !getFieldValue('packageId')) {
                      return Promise.reject(new Error('Select a service or package'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Select a service"
                size="large"
                onChange={(val) => {
                  form.setFieldsValue({ packageId: undefined, couponCode: undefined });
                  setAppliedCoupon(null);
                }}
              >
                {servicesList?.data
                  .filter((s: any) => s.isActive)
                  .map((s: any) => (
                    <Option key={s.id} value={s.id}>{s.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item 
              name="packageId" 
              label="Package (Optional)" 
              dependencies={['serviceId']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value && !getFieldValue('serviceId')) {
                      return Promise.reject(new Error('Select a service or package'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Select a package bundle"
                size="large"
                allowClear
                onChange={() => {
                  form.setFieldsValue({ couponCode: undefined });
                  setAppliedCoupon(null);
                }}
              >
                {packagesList?.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.name} ({p.durationMonths}mo) - ₹{p.offerPrice}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Required' }]} initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>
            <Form.Item name="endDate" label="End Date (Expiry)">
              <DatePicker 
                style={{ width: '100%' }} 
                size="large" 
                placeholder="No expiry"
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Form.Item name="couponCode" noStyle>
              <Input placeholder="Enter Coupon Code" size="large" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
            <Button type="primary" size="large" onClick={handleApplyCoupon} loading={couponLoading}>
              Apply
            </Button>
          </Space.Compact>

          {appliedCoupon && (
            <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px' }}>
              <Flex justify="space-between">
                <Text type="success"><CheckCircleOutlined /> Coupon Applied: {appliedCoupon.code}</Text>
                <Text strong style={{ color: '#52c41a' }}>- ₹{appliedCoupon.discountAmount}</Text>
              </Flex>
            </div>
          )}

          <Form.Item name="amount" label="Final Agreed Price (₹)" rules={[{ required: true }]}>
            <InputNumber 
              style={{ width: '100%', fontSize: '18px', fontWeight: 'bold' }} 
              min={0} 
              size="large" 
              prefix="₹" 
            />
          </Form.Item>

          <Divider orientation={"left" as any} style={{ fontSize: '12px' }}>Communication Channels</Divider>
          <Flex gap={24} style={{ marginBottom: 16 }}>
            <Form.Item name="notificationEmail" label="Email" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item name="notificationSms" label="SMS" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item name="notificationWhatsapp" label="WhatsApp" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </Flex>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
              Assign and Send Link
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Subscriptions;
