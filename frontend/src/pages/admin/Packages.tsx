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
  Divider,
  List
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  GiftOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { usePackages, useCreatePackage, useUpdatePackage, useDeletePackage, useServices } from '../../hooks/useApi';
import type { Package } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Packages: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [form] = Form.useForm();

  const { data: services } = useServices({ page: 1, limit: 1000, isActive: true });
  const { data: packages, isLoading, refetch } = usePackages({ serviceId: serviceFilter });
  
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();

  const filteredData = packages?.filter(pkg => 
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.services?.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (values: any) => {
    try {
      if (editingPkg) {
        await updateMutation.mutateAsync({ id: editingPkg.id, data: values });
        message.success('Package updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Package created successfully');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingPkg(null);
    } catch (err) {
      message.error('Failed to save package');
    }
  };

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Included Products',
      dataIndex: 'services',
      key: 'services',
      render: (services: any[]) => (
        <Flex gap={4} wrap="wrap">
          {services?.map(s => (
            <Tag key={s.id} color="blue" icon={<AppstoreOutlined />}>{s.name}</Tag>
          ))}
          {(!services || services.length === 0) && <Text type="secondary">No products</Text>}
        </Flex>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'durationMonths',
      key: 'duration',
      render: (months: number) => {
        if (months === 1) return '1 Month';
        if (months === 3) return 'Quarterly (3 Mo)';
        if (months === 12) return 'Yearly';
        if (months >= 24) return `${months / 12} Years`;
        return `${months} Months`;
      }
    },
    {
      title: 'Actual Price',
      dataIndex: 'actualPrice',
      key: 'actualPrice',
      render: (price: number) => <Text delete type="secondary">₹{Number(price).toLocaleString()}</Text>,
    },
    {
      title: 'Offer Price',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      render: (price: number) => <Text strong style={{ color: 'var(--color-primary)' }}>₹{Number(price).toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Package) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingPkg(record);
              form.setFieldsValue({
                ...record,
                serviceIds: record.services?.map(s => s.id)
              });
              setIsModalOpen(true);
            }} 
          />
          <Popconfirm
            title="Delete Package"
            description="Are you sure you want to delete this package?"
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

  const durationOptions = [
    { label: '1 Month', value: 1 },
    { label: 'Quarterly (3 Months)', value: 3 },
    { label: 'Yearly (12 Months)', value: 12 },
    ...Array.from({ length: 9 }, (_, i) => ({ label: `${i + 2} Years`, value: (i + 2) * 12 }))
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
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? '24px' : '30px' }}>Packages</Title>
        <Flex gap={8} style={{ width: isMobile ? '100%' : 'auto' }}>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => refetch()}
            style={{ flex: isMobile ? 1 : 'none' }}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingPkg(null); form.resetFields(); setIsModalOpen(true); }}
            style={{ flex: isMobile ? 2 : 'none' }}
          >
            New Package
          </Button>
        </Flex>
      </Flex>

      <Card className="card-shadow" style={{ marginBottom: 16, borderRadius: '12px' }} styles={{ body: { padding: isMobile ? '12px' : '24px' } }}>
        <Flex vertical={isMobile} gap={16}>
          <Input
            placeholder="Search packages..."
            prefix={<SearchOutlined style={{ color: 'var(--color-primary)' }} />}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, borderRadius: '8px' }}
            allowClear
          />
          <Select
            placeholder="Filter by Product"
            style={{ width: isMobile ? '100%' : 250 }}
            allowClear
            onChange={setServiceFilter}
          >
            {services?.data.map(s => (
              <Option key={s.id} value={s.id}>{s.name}</Option>
            ))}
          </Select>
        </Flex>
      </Card>

      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          rowKey="id"
          className="card-shadow"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
      ) : (
        <Flex vertical gap={12} style={{ paddingBottom: 80 }}>
          {filteredData?.map((item: Package) => (
            <Card 
              key={item.id} 
              className="card-shadow" 
              style={{ borderRadius: '12px' }}
              styles={{ body: { padding: '12px' } }}
            >
              <Flex vertical gap={10}>
                <Flex justify="space-between" align="center">
                  <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                  <Tag color={item.isActive ? 'success' : 'default'}>
                    {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                </Flex>

                <Flex vertical gap={4}>
                  <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>INCLUDED PRODUCTS</Text>
                  <Flex gap={4} wrap="wrap">
                    {item.services?.map(s => (
                      <Tag key={s.id} color="blue" icon={<AppstoreOutlined />} style={{ margin: 0 }}>
                        {s.name}
                      </Tag>
                    ))}
                  </Flex>
                </Flex>

                <Divider style={{ margin: '4px 0' }} />

                <Flex justify="space-between" align="center">
                  <Flex vertical gap={2}>
                    <Text type="secondary" style={{ fontSize: '10px' }}><CalendarOutlined /> DURATION</Text>
                    <Text strong>
                      {item.durationMonths === 1 ? '1 mo' : 
                       item.durationMonths === 3 ? 'Qtly' : 
                       item.durationMonths === 12 ? 'Yearly' : 
                       `${item.durationMonths / 12} Yrs`}
                    </Text>
                  </Flex>
                  <Flex vertical gap={2} style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}><DollarOutlined /> OFFER PRICE</Text>
                    <Flex align="center" gap={4}>
                      <Text delete type="secondary" style={{ fontSize: '11px' }}>₹{Number(item.actualPrice).toLocaleString()}</Text>
                      <Text strong style={{ color: 'var(--color-primary)' }}>₹{Number(item.offerPrice).toLocaleString()}</Text>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex gap={8} style={{ marginTop: 4 }}>
                  <Button 
                    icon={<EditOutlined />} 
                    block
                    onClick={() => {
                      setEditingPkg(item);
                      form.setFieldsValue({
                        ...item,
                        serviceIds: item.services?.map(s => s.id)
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete Package"
                    onConfirm={() => deleteMutation.mutateAsync(item.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
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
        title={
          <Space orientation="vertical" size={2}>
            <Text strong style={{ fontSize: '18px' }}>{editingPkg ? "Edit Package" : "Create Package"}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>Configure your product bundle details</Text>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={isMobile ? '100%' : 600}
        style={{ top: isMobile ? 10 : 100 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="serviceIds" label="Included Products/Services" rules={[{ required: true, message: 'Please select at least one product' }]}>
            <Select 
              mode="multiple"
              placeholder="Select products to bundle" 
              showSearch 
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {services?.data.map(s => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="name" label="Package Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Starter Pack, Enterprise Pro" />
          </Form.Item>

          <Form.Item name="durationMonths" label="Duration" rules={[{ required: true }]}>
            <Select placeholder="Select duration">
              {durationOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Flex gap={16} vertical={isMobile}>
            <Form.Item name="actualPrice" label="Actual Price (₹)" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} prefix="₹" size="large" />
            </Form.Item>
            <Form.Item name="offerPrice" label="Offer Price (₹)" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} prefix="₹" size="large" />
            </Form.Item>
          </Flex>

          <Form.Item name="isActive" label="Is Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={createMutation.isPending || updateMutation.isPending}>
              {editingPkg ? "Update Package" : "Create Package"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Packages;
