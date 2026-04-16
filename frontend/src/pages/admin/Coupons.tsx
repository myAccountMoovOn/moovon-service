import React, { useState } from 'react';
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
  Flex,
  Card,
  Popconfirm,
  Space,
  Grid,
  DatePicker
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../../hooks/useApi';
import type { Coupon } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Coupons: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  const { data: coupons, isLoading, refetch } = useCoupons();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const filteredData = coupons?.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
      };

      if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon.id, data: payload });
        message.success('Coupon updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Coupon created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCoupon(null);
    } catch (err) {
      message.error('Failed to save coupon');
    }
  };

  const columns = [
    {
      title: 'Coupon Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="purple" style={{ fontWeight: 'bold', padding: '4px 12px', fontSize: '14px' }}>{text}</Tag>,
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_: any, record: Coupon) => (
        <Text strong>
          {record.type === 'percentage' ? `${record.value}%` : `₹${Number(record.value).toLocaleString()}`} OFF
        </Text>
      ),
    },
    {
      title: 'Min. Purchase',
      dataIndex: 'minPurchaseAmount',
      key: 'minPurchase',
      render: (amount: number) => `₹${Number(amount).toLocaleString()}`,
    },
    {
      title: 'Expires On',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => date ? dayjs(date).format('DD MMM YYYY') : <Text type="secondary">Never</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean, record: Coupon) => {
        const isExpired = record.expiryDate && dayjs(record.expiryDate).isBefore(dayjs());
        if (isExpired) return <Tag color="error">EXPIRED</Tag>;
        return <Tag color={active ? 'success' : 'default'}>{active ? 'ACTIVE' : 'INACTIVE'}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Coupon) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingCoupon(record);
              form.setFieldsValue({
                ...record,
                expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
              });
              setIsModalOpen(true);
            }} 
          />
          <Popconfirm
            title="Delete Coupon"
            onConfirm={() => deleteMutation.mutateAsync(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '0' : '0 8px' }}>
      <Flex 
        vertical={isMobile} 
        justify="space-between" 
        align={isMobile ? 'stretch' : 'center'} 
        gap={16}
        style={{ marginBottom: 24 }}
      >
        <Title level={2} style={{ margin: 0 }}>Coupons</Title>
        <Space style={{ width: isMobile ? '100%' : 'auto' }}>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} block={isMobile}>Refresh</Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingCoupon(null); form.resetFields(); setIsModalOpen(true); }}
            block={isMobile}
          >
            Create Coupon
          </Button>
        </Space>
      </Flex>

      <Card className="card-shadow" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by code..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: isMobile ? '100%' : 400 }}
          size="large"
          allowClear
        />
      </Card>

      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          rowKey="id"
          className="card-shadow"
        />
      ) : (
        <Flex vertical gap={12}>
          {filteredData?.map((item: Coupon) => (
            <Card key={item.id} className="card-shadow" styles={{ body: { padding: '16px' } }}>
              <Flex vertical gap={12}>
                <Flex justify="space-between" align="center">
                  <Tag color="purple" style={{ fontWeight: 'bold' }}>{item.code}</Tag>
                  <Tag color={item.isActive ? 'success' : 'default'}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Tag>
                </Flex>
                
                <Flex justify="space-between">
                  <Flex vertical>
                    <Text type="secondary" style={{ fontSize: '10px' }}>DISCOUNT</Text>
                    <Text strong>{item.type === 'percentage' ? `${item.value}%` : `₹${item.value}`} OFF</Text>
                  </Flex>
                  <Flex vertical style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>MIN. PURCHASE</Text>
                    <Text strong>₹{item.minPurchaseAmount}</Text>
                  </Flex>
                </Flex>

                <Flex vertical>
                  <Text type="secondary" style={{ fontSize: '10px' }}>EXPIRY</Text>
                  <Text>{item.expiryDate ? dayjs(item.expiryDate).format('DD MMM YYYY') : 'Never'}</Text>
                </Flex>

                <Flex gap={8}>
                  <Button 
                    icon={<EditOutlined />} 
                    block
                    onClick={() => {
                      setEditingCoupon(item);
                      form.setFieldsValue({
                        ...item,
                        expiryDate: item.expiryDate ? dayjs(item.expiryDate) : null,
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete Coupon"
                    onConfirm={() => deleteMutation.mutateAsync(item.id)}
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <Modal
        title={editingCoupon ? "Edit Coupon" : "New Coupon"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={isMobile ? '100%' : 500}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ type: 'percentage', isActive: true, minPurchaseAmount: 0 }}>
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true, message: 'Code is required' }]}>
            <Input placeholder="e.g. SAVE10, WELCOME500" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Flex gap={16} vertical={isMobile}>
            <Form.Item name="type" label="Discount Type" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Option value="percentage">Percentage (%)</Option>
                <Option value="fixed">Fixed Amount (₹)</Option>
              </Select>
            </Form.Item>
            <Form.Item name="value" label="Discount Value" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Flex>

          <Form.Item name="minPurchaseAmount" label="Min Purchase Amount (₹)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" showToday />
          </Form.Item>

          <Form.Item name="isActive" label="Is Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={createMutation.isPending || updateMutation.isPending}>
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Coupons;
