import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Modal, 
  Form, 
  Typography, 
  App,
  Space,
  Popconfirm,
  Grid,
  Card,
  Flex
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useApi';
import type { Category } from '../../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Categories: React.FC = () => {
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const isMobile = !screens.md;

  const { data: categories, isLoading, refetch } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const filteredCategories = categories?.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      responsive: ['md' as const],
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['lg' as const],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: Category) => (
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
            title="Delete Category"
            description="Are you sure you want to delete this category? This might affect products linked to it."
            onConfirm={async () => {
                try {
                    await deleteMutation.mutateAsync(record.id);
                    message.success('Category deleted successfully');
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
        await updateMutation.mutateAsync({ id: editingId, data: values });
        message.success('Category updated');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Category created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save category');
    }
  };

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
          <Title level={2} style={{ margin: 0, fontSize: 'clamp(22px, 5vw, 32px)' }}>Categories</Title>
          <Text type="secondary">Manage product and service categories</Text>
        </Flex>
        
        <Flex gap={8} wrap="wrap" style={{ width: isMobile ? '100%' : 'auto' }}>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} block={isMobile}>Refresh</Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
            block={isMobile}
          >
            New Category
          </Button>
        </Flex>
      </Flex>

      <Card 
        className="card-shadow" 
        style={{ marginBottom: 16, borderRadius: '12px' }}
        styles={{ body: { padding: isMobile ? '12px 16px' : '16px 24px' } }}
      >
        <Input
          placeholder="Search categories..."
          prefix={<SearchOutlined style={{ color: 'var(--color-primary)' }} />}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          size="middle"
          style={{ maxWidth: isMobile ? '100%' : 400, borderRadius: '8px' }}
        />
      </Card>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        className="card-shadow"
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      />

      <Modal
        title={editingId ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={isMobile ? '100%' : 480}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ isActive: true }}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
            <Input placeholder="e.g. IT Services, Marketing" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Brief description of the category" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Update Category' : 'Create Category'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
