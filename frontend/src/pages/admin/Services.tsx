import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Modal, 
  Form, 
  Tag, 
  Typography, 
  Select, 
  InputNumber, 
  Switch,
  App,
  Space,
  Popconfirm,
  Grid,
  Card,
  Radio,
  DatePicker,
  Flex,
  List,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  TagOutlined,
  DollarOutlined,
  CalendarOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useServices, useDeleteService } from '../../hooks/useApi';
import type { Service } from '../../types';
import { PricingType, DurationType } from '../../types';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const Services: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [period, setPeriod] = useState<string>('all');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const isMobile = !screens.md;

  // Date Logic
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

  const { data, isLoading, refetch } = useServices({ 
    page, 
    limit: 10, 
    search,
    isActive: statusFilter === 'active' ? true : (statusFilter === 'inactive' ? false : undefined),
    ...dateParams
  });

  const deleteMutation = useDeleteService();

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as const,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['lg' as const],
    },
    {
      title: 'Type',
      dataIndex: 'pricingType',
      responsive: ['sm' as const],
      render: (type: string) => (
        <Tag color={type === 'custom' ? 'purple' : 'blue'}>
          {type === 'custom' ? 'SUBSCRIPTION' : type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'durationType',
      responsive: ['md' as const],
      render: (text: string) => text ? text.replace('_', ' ').toUpperCase() : '-',
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      width: 120,
      render: (val: number) => (
        <Text strong style={{ whiteSpace: 'nowrap' }}>
          ₹ {Number(val).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      width: 80,
      render: (val: boolean, record: Service) => (
        <Switch 
          size="medium"
          checked={val} 
          onChange={(checked) => toggleActive(record.id, checked)} 
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: Service) => (
        <Flex gap={8}>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }} 
          />
          <Popconfirm
            title="Delete Service"
            description="Are you sure you want to delete this service?"
            onConfirm={async () => {
                try {
                    const response: any = await deleteMutation.mutateAsync(record.id);
                    message.success(response?.message || 'Service deleted successfully');
                    refetch();
                } catch (err: any) {
                    message.error(err.response?.data?.message || 'Delete failed');
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

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await axiosInstance.patch(`/services/${editingId}`, values);
        message.success('Service updated');
      } else {
        await axiosInstance.post('/services', values);
        message.success('Service created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      refetch();
    } catch (err: any) {
      message.error('Failed to save service');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axiosInstance.patch(`/services/${id}`, { isActive });
      message.success(`Service ${isActive ? 'activated' : 'deactivated'}`);
      refetch();
    } catch (err) {
      message.error('Failed to toggle status');
    }
  };

  const currentPricingType = Form.useWatch('pricingType', form);

  return (
    <div style={{ padding: isMobile ? '0' : '0 8px' }}>
      <Flex 
        vertical={isMobile} 
        justify="space-between" 
        align={isMobile ? "flex-start" : "center"} 
        gap={16} 
        style={{ marginBottom: 24 }}
      >
        <Flex vertical gap={4}>
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(22px, 5vw, 32px)' }}>Services Catalog</Title>
        </Flex>
        
        <Flex gap={8} wrap="wrap" style={{ width: isMobile ? '100%' : 'auto' }}>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} block={isMobile}>Refresh</Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
            block={isMobile}
          >
            New Service
          </Button>
        </Flex>
      </Flex>

      <Card 
        className="card-shadow" 
        style={{ marginBottom: 16, borderRadius: '12px' }}
        styles={{ body: { padding: isMobile ? '12px 16px' : '16px 24px' } }}
      >
        <Flex vertical={isMobile} gap={16}>
          <Flex vertical={isMobile} gap={10} flex={1} align={isMobile ? 'stretch' : 'center'}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: 'var(--color-primary)' }} />}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="middle"
              style={{ flex: 1, borderRadius: '8px' }}
            />
            
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter} 
              size="middle"
              style={{ width: isMobile ? '100%' : 150 }}
              placeholder="All Services"
              styles={{ popup: { root: { borderRadius: '8px' } } }}
              options={[
                { label: 'All Services', value: 'all' },
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
        <Flex vertical gap={12} style={{ paddingBottom: 80 }}>
          {Array.isArray(data?.data) && data.data.map((item: Service) => (
            <Card 
              key={item.id}
              style={{ borderRadius: '10px' }} 
              className="card-shadow"
              styles={{ body: { padding: '6px 12px' } }}
            >
              <Flex vertical gap={8}>
                <Flex justify="space-between" align="center">
                  <Flex vertical gap={0}>
                    <Text strong style={{ fontSize: '14px' }}>{item.name}</Text>
                    <Tag color="cyan" style={{ fontSize: '10px', width: 'fit-content', padding: '0 4px' }}>{item.category}</Tag>
                  </Flex>
                  <Switch 
                    checked={item.isActive} 
                    onChange={(checked) => toggleActive(item.id, checked)}
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<StopOutlined />}
                  />
                </Flex>

                <Divider style={{ margin: '4px 0' }} />

                <Flex justify="space-between" align="center">
                  <Flex vertical gap={2}>
                    <Text type="secondary" style={{ fontSize: '11px' }}><SettingOutlined /> MODEL</Text>
                    <Tag color={item.pricingType === 'custom' ? 'purple' : 'blue'} style={{ width: 'fit-content' }}>
                       {item.pricingType === 'custom' ? 'SUBSCRIPTION' : item.pricingType.toUpperCase()}
                    </Tag>
                  </Flex>
                  <Flex vertical gap={2} style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}><DollarOutlined /> BASE PRICE</Text>
                    <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      ₹{Number(item.basePrice).toLocaleString()}
                    </Text>
                  </Flex>
                </Flex>

                <Flex justify="space-between" align="center" style={{ background: '#f5f5f5', padding: '10px 15px', borderRadius: '10px' }}>
                  <Flex gap={8} align="center">
                    <CalendarOutlined style={{ color: 'var(--color-text-secondary)' }} />
                    <Text style={{ fontSize: '12px' }}>
                      {item.durationType ? item.durationType.replace('_', ' ').toUpperCase() : 'ONE-TIME'}
                    </Text>
                  </Flex>
                  <Flex gap={8}>
                    <Button 
                      type="text" 
                      icon={<EditOutlined style={{ color: 'var(--color-primary)' }} />} 
                      onClick={() => {
                        setEditingId(item.id);
                        form.setFieldsValue(item);
                        setIsModalOpen(true);
                      }}
                    />
                    <Popconfirm
                      title="Delete Service?"
                      onConfirm={async () => {
                        try {
                          await deleteMutation.mutateAsync(item.id);
                          message.success('Deleted');
                          refetch();
                        } catch (err) {
                          message.error('Failed');
                        }
                      }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Flex>
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
        title={editingId ? "Edit Service" : "Add Service"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={isMobile ? '100%' : 540}
        style={{ top: isMobile ? 10 : 100 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Website Hosting" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input placeholder="e.g. IT Services" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Form.Item name="pricingType" label="Pricing Type" rules={[{ required: true }]}>
              <Select>
                <Option value={PricingType.FIXED}>Fixed Rate</Option>
                <Option value={PricingType.CUSTOM}>Subscription</Option>
              </Select>
            </Form.Item>
            <Form.Item name="durationType" label="Billing Cycle" rules={[{ required: !currentPricingType || currentPricingType !== 'fixed' }]}>
              <Select disabled={currentPricingType === PricingType.FIXED} placeholder={currentPricingType === PricingType.FIXED ? "N/A" : "Select cycle"}>
                <Option value={DurationType.MONTHLY}>Monthly</Option>
                <Option value={DurationType.QUARTERLY}>Quarterly</Option>
                <Option value={DurationType.YEARLY}>Yearly</Option>
                <Option value={DurationType.CUSTOM}>Subscription</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="basePrice" label="Base Price (₹)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="isActive" label="Is Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Save Service
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
