import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Tag, 
  Typography, 
  Modal, 
  Input, 
  Select, 
  Card,
  Row,
  Col,
  App
} from 'antd';
import { PlusOutlined, EditOutlined, NotificationOutlined } from '@ant-design/icons';
import { useTemplates } from '../../hooks/useApi';
import type { Template } from '../../types';
import { NotificationChannel, NotificationTemplateType } from '../../types';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Templates: React.FC = () => {
  const { message } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data: templates, isLoading, refetch } = useTemplates();

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await axiosInstance.patch(`/templates/${editingId}`, values);
        message.success('Template updated');
      } else {
        await axiosInstance.post('/templates', values);
        message.success('Template created');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      refetch();
    } catch (err) {
      message.error('Failed to save template');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (c: string) => (
        <Tag color={c === 'email' ? 'cyan' : 'magenta'}>
          {c.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (t: string) => <Tag color="blue">{t.replace('_', ' ').toUpperCase()}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Template) => (
        <Button 
          icon={<EditOutlined />} 
          size="small" 
          onClick={() => {
            setEditingId(record.id);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }} 
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Message Templates</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}>
          New Template
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={templates}
        loading={isLoading}
        rowKey="id"
        className="card-shadow"
      />

      <Modal
        title={editingId ? "Edit Template" : "Add Template"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Template Display Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Email - Renewal Invitation" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="channel" label="Channel" rules={[{ required: true }]}>
                <Select>
                  <Option value={NotificationChannel.EMAIL}>Email</Option>
                  <Option value={NotificationChannel.SMS}>SMS</Option>
                  <Option value={NotificationChannel.WHATSAPP}>WhatsApp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Trigger Event Type" rules={[{ required: true }]}>
                <Select>
                  <Option value={NotificationTemplateType.RENEWAL_REMINDER}>Renewal Reminder</Option>
                  <Option value={NotificationTemplateType.PAYMENT_REMINDER}>Payment Reminder</Option>
                  <Option value={NotificationTemplateType.EXPIRY_ALERT}>Expiry Alert</Option>
                  <Option value={NotificationTemplateType.FOLLOW_UP}>Follow Up</Option>
                  <Option value={NotificationTemplateType.WELCOME}>Welcome</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="subject" label="Subject (Email only)">
            <Input placeholder="Your service is about to expire" />
          </Form.Item>
          <Form.Item name="body" label="Message Body" rules={[{ required: true }]}>
            <TextArea rows={6} placeholder="Use variables like {{customer_name}}, {{service_name}}, {{payment_link}}" />
          </Form.Item>
          
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Available variables: <b>{`{{customer_name}}, {{service_name}}, {{amount}}, {{start_date}}, {{end_date}}, {{payment_link}}`}</b>
            </Text>
          </Card>

          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<NotificationOutlined />}>
              Save Message Template
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Templates;
