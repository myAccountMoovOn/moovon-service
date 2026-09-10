import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form, 
  Tag, 
  Typography, 
  Upload,
  App,
  Popconfirm,
  Grid,
  Card,
  Radio,
  Select,
  DatePicker,
  Switch,
  Result,
  Divider,
  Alert,
  List,
  Flex,
  Drawer,
  Avatar,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ImportOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CopyOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  HistoryOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../../hooks/useApi';
import type { Customer } from '../../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [period, setPeriod] = useState<string>('all');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  const isMobile = !screens.md;

  // Filter Logic
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

  const { data, isLoading, refetch } = useCustomers({ 
    page, 
    limit: 10, 
    search,
    isActive: statusFilter === 'active' ? true : (statusFilter === 'inactive' ? false : undefined),
    ...dateParams
  });

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left' as const,
      render: (_: any, record: Customer) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 'bold' }}>{record.name}</span>
          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</span>
        </Space>
      ),
    },
    {
      title: 'Department / Category',
      dataIndex: 'companyName',
      responsive: ['lg' as const],
      render: (text: string) => text || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      responsive: ['sm' as const],
    },
    {
      title: 'Active Subs',
      render: (_: any, record: any) => record.subscriptionsCount || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      responsive: ['md' as const],
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: Customer) => (
        <Space direction="horizontal" size="middle">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => navigate(`/admin/customers/${record.id}`)}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => {
                setEditingCustomer(record);
                form.setFieldsValue(record);
                setIsModalOpen(true);
            }} 
          />
          <Popconfirm
            title="Delete Customer"
            description="Are you sure you want to delete this customer?"
            onConfirm={async () => {
                try {
                    await deleteMutation.mutateAsync(record.id);
                    message.success('Customer deleted');
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
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({ id: editingCustomer.id, ...values });
        message.success('Customer updated successfully');
      } else {
        const result = await createMutation.mutateAsync(values);
        message.success('Customer created successfully');
        if (result && result.password) {
          setCreatedCredentials({
            email: result.email,
            password: result.password
          });
        }
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCustomer(null);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save customer');
    }
  };

  const handleImport = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      refetch();
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div style={{ padding: isMobile ? '0' : '0 8px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: isMobile ? 16 : 0,
        marginBottom: 24 
      }}>
        <Title 
          level={2} 
          style={{ 
            margin: 0,
            fontSize: 'clamp(20px, 5vw, 30px)',
            maxWidth: '100%'
          }}
        >
          Customers
        </Title>
        <Space direction="horizontal" wrap={isMobile} style={{ width: isMobile ? '100%' : 'auto' }}>
          <Upload
            name="file"
            action={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'}/customers/bulk-import`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`
            }}
            onChange={handleImport}
            showUploadList={false}
          >
            <Button icon={<ImportOutlined />} block={isMobile}>Bulk Import</Button>
          </Upload>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingCustomer(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
            block={isMobile}
          >
            Add Customer
          </Button>
        </Space>
      </div>

      <Card 
        className="card-shadow" 
        style={{ marginBottom: 16, borderRadius: '12px', border: 'none' }}
        styles={{ body: { padding: isMobile ? '12px 16px' : '16px 24px' } }}
      >
        <Flex vertical={isMobile} gap={16}>
          <Flex vertical={isMobile} gap={10} flex={1} align={isMobile ? 'stretch' : 'center'}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: 'var(--color-primary)' }} />}
              onChange={(e) => setSearch(e.target.value)}
              size="middle"
              allowClear
              style={{ flex: 1, borderRadius: '8px' }}
            />
            
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter} 
              size="middle"
              style={{ width: isMobile ? '100%' : 150 }}
              placeholder="All Accounts"
              styles={{ popup: { root: { borderRadius: '8px' } } }}
              options={[
                { label: 'All Accounts', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />

            <Flex vertical={isMobile} gap={8} align={isMobile ? 'stretch' : 'center'}>
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
        />
      ) : (
        <div style={{ paddingBottom: 80 }}>
            {Array.isArray(data?.data) ? data.data.map((item: Customer, index: number) => (
                <Card 
                  key={item.id || index}
                  onClick={() => {
                        setSelectedCustomer(item);
                        setIsDrawerOpen(true);
                  }}
                  style={{ marginBottom: 6, borderRadius: '10px', border: '1px solid #f0f0f0', cursor: 'pointer' }} 
                  className="card-shadow-sm"
                  styles={{ body: { padding: '6px 12px' } }}
                >
                  <Flex justify="space-between" align="center">
                    <Flex gap={8} align="center">
                        <Avatar 
                            size="small"
                            style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
                            icon={<UserOutlined />}
                        />
                        <Flex vertical gap={0}>
                            <Text strong style={{ fontSize: '13px', lineHeight: 1.2 }}>{item.name}</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>{item.phone}</Text>
                        </Flex>
                    </Flex>
                    <Tag color={item.isActive ? 'success' : 'error'} style={{ borderRadius: '6px', margin: 0 }}>
                        {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Tag>
                  </Flex>
                </Card>
            )) : !isLoading && (
                <Empty description="No customers found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            
            {/* Mobile Pagination */}
            {data?.total && data.total > 10 && (
                <Flex justify="center" style={{ marginTop: 24 }}>
                    <Radio.Group 
                        value={page} 
                        onChange={e => setPage(e.target.value)}
                        size="small"
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value={Math.max(1, page - 1)} disabled={page === 1}>Prev</Radio.Button>
                        <Radio.Button value={page}>Page {page}</Radio.Button>
                        <Radio.Button value={page + 1} disabled={page * 10 >= data.total}>Next</Radio.Button>
                    </Radio.Group>
                </Flex>
            )}
        </div>
      )}

      <Drawer
        title={
            <Flex align="center" gap={12}>
                <Avatar 
                    style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
                    icon={<UserOutlined />}
                />
                <div>
                    <Text strong style={{ display: 'block' }}>Customer Insight</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>Profile & Metadata Audit</Text>
                </div>
            </Flex>
        }
        placement="bottom"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '24px', paddingBottom: '40px' }, header: { borderBottom: '1px solid #f0f0f0' } }}
      >
        {selectedCustomer && (
            <Flex vertical gap={24}>
                <Flex vertical gap={4}>
                    <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Primary Identity</Text>
                    <Title level={3} style={{ margin: 0 }}>{selectedCustomer.name}</Title>
                    <Tag 
                        color={selectedCustomer.isActive ? 'success' : 'error'} 
                        style={{ width: 'fit-content', borderRadius: '4px' }}
                    >
                        {selectedCustomer.isActive ? 'VERIFIED ACTIVE' : 'INACTIVE ACCOUNT'}
                    </Tag>
                </Flex>

                <Divider style={{ margin: 0 }} />

                <Flex vertical gap={16}>
                    <Flex justify="space-between">
                        <Text type="secondary">Contact Phone</Text>
                        <Text strong>{selectedCustomer.phone}</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text type="secondary">Email Address</Text>
                        <Text strong>{selectedCustomer.email}</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text type="secondary">Department / Category</Text>
                        <Text strong>{selectedCustomer.companyName || '-'}</Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text type="secondary">Joined On</Text>
                        <Text strong>{dayjs(selectedCustomer.createdAt).format('DD MMM YYYY')}</Text>
                    </Flex>
                </Flex>

                <Divider style={{ margin: 0 }} />

                <Flex vertical gap={12}>
                    <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Communication Channels</Text>
                    <Flex gap={8} wrap="wrap">
                        <Tag color={selectedCustomer.notificationEmail !== false ? 'success' : 'default'}>
                            {selectedCustomer.notificationEmail !== false ? 'EMAIL ON' : 'EMAIL OFF'}
                        </Tag>
                        <Tag color={selectedCustomer.notificationSms !== false ? 'success' : 'default'}>
                            {selectedCustomer.notificationSms !== false ? 'SMS ON' : 'SMS OFF'}
                        </Tag>
                        <Tag color={selectedCustomer.notificationWhatsapp !== false ? 'success' : 'default'}>
                            {selectedCustomer.notificationWhatsapp !== false ? 'WHATSAPP ON' : 'WHATSAPP OFF'}
                        </Tag>
                    </Flex>
                </Flex>

                <Alert 
                    title="Business Metadata"
                    description={
                        <Flex vertical gap={2}>
                            <Text style={{ display: 'block', fontSize: '13px' }}>GSTIN: <Text strong>{selectedCustomer.gstNumber || 'Not Provided'}</Text></Text>
                            <Text style={{ display: 'block', fontSize: '13px' }}>Address: <Text strong>{selectedCustomer.address || 'No Address Data'}</Text></Text>
                        </Flex>
                    }
                    type="info"
                    showIcon
                    icon={<SolutionOutlined />}
                    style={{ borderRadius: '12px' }}
                />

                <Flex vertical gap={12} style={{ marginTop: 8 }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<EyeOutlined />} 
                        onClick={() => navigate(`/admin/customers/${selectedCustomer.id}`)}
                        block
                        style={{ borderRadius: '10px' }}
                    >
                        View Full History
                    </Button>
                    <Flex gap={12}>
                        <Button 
                            style={{ flex: 1, borderRadius: '10px' }} 
                            size="large"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsDrawerOpen(false);
                                setEditingCustomer(selectedCustomer);
                                form.setFieldsValue(selectedCustomer);
                                setIsModalOpen(true);
                            }}
                        >
                            Edit Profile
                        </Button>
                        <Popconfirm
                            title="Delete Customer?"
                            description="This action cannot be undone."
                            onConfirm={async () => {
                                try {
                                    await deleteMutation.mutateAsync(selectedCustomer.id);
                                    message.success('Deleted');
                                    setIsDrawerOpen(false);
                                } catch (err) {
                                    message.error('Failed to delete');
                                }
                            }}
                        >
                            <Button 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="large"
                                style={{ borderRadius: '10px' }}
                            />
                        </Popconfirm>
                    </Flex>
                </Flex>
            </Flex>
        )}
      </Drawer>

      <Modal
        title={editingCustomer ? "Edit Customer" : "Create New Customer"}
        open={isModalOpen}
        onCancel={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
            form.resetFields();
        }}
        footer={null}
        width={isMobile ? '100%' : 520}
        style={{ top: isMobile ? 20 : 100 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, max: 10, message: 'Name cannot exceed 10 characters' }]}>
            <Input placeholder="John Doe" maxLength={10} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="john@example.com" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="+91 9876543210" />
          </Form.Item>
          <Form.Item name="companyName" label="Department / Category (Optional)">
            <Input placeholder="e.g., Electronics / IT Dept" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="123 Street, City" />
          </Form.Item>
          <Form.Item name="gstNumber" label="GST Number">
            <Input placeholder="22AAAAA0000A1Z5" />
          </Form.Item>
          <Form.Item name="isActive" label="Account Status" valuePropName="checked" initialValue={true}>
            <Radio.Group>
              <Radio value={true}>Active Account</Radio>
              <Radio value={false}>Inactive Account</Radio>
            </Radio.Group>
          </Form.Item>

          {!editingCustomer && (
            <Form.Item 
              name="sendLoginCredentials" 
              label="Send Login Details via Email" 
              valuePropName="checked" 
              initialValue={true}
              extra="Customer will receive an automated email with their login ID and password."
            >
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          )}

          <Divider orientation={"left" as any} style={{ fontSize: '12px' }}>Communication Channels</Divider>
          <Flex gap={24} style={{ marginBottom: 24 }}>
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending} block>
              {editingCustomer ? "Update Customer" : "Create Customer"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Success Credentials Modal */}
      <Modal
        title={null}
        open={!!createdCredentials}
        onCancel={() => setCreatedCredentials(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setCreatedCredentials(null)}>
            Close and Continue
          </Button>
        ]}
        width={480}
        centered
        closable={false}
      >
        <Result
          status="success"
          title="Customer Created Successfully!"
          subTitle="Secure login credentials have been generated for use in the Customer Portal."
          style={{ padding: '24px 0' }}
        >
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}><MailOutlined /> LOGIN ID (EMAIL)</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <Text strong style={{ fontSize: '16px' }}>{createdCredentials?.email}</Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<CopyOutlined />} 
                  onClick={() => {
                    navigator.clipboard.writeText(createdCredentials?.email || '');
                    message.success('Login ID copied');
                  }}
                />
              </div>
            </div>
            
            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}><LockOutlined /> GENERATED PASSWORD</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <Text strong style={{ fontSize: '16px', letterSpacing: '1px' }}>{createdCredentials?.password}</Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<CopyOutlined />} 
                  onClick={() => {
                    navigator.clipboard.writeText(createdCredentials?.password || '');
                    message.success('Password copied');
                  }}
                />
              </div>
            </div>
          </div>
          
          <Alert
            message="Secure Delivery"
            description="Inform the customer that they can also login using an OTP sent to their email for a faster experience."
            type="info"
            showIcon
            style={{ marginTop: 24 }}
          />
        </Result>
      </Modal>
    </div>
  );
};

export default Customers;
