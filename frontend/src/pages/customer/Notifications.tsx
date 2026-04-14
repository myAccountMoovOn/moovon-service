import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, message, Empty, Space, Grid, List } from 'antd';
import { NotificationOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const CustomerNotifications: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/notifications/my-logs');
      setLogs(data.data?.data || []); // Paginated response contains data.data.data
    } catch (err) {
      message.error('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      title: 'Sent At',
      dataIndex: 'sentAt',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY (hh:mm A)') : 'Pending',
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (channel: string) => (
        <Space>
          {channel === 'email' ? <MailOutlined /> : <MessageOutlined />}
          <Text>{channel.toUpperCase()}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'templateType',
      render: (type: string) => (
        <Text strong>{type.replace(/_/g, ' ').toUpperCase()}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'sent' ? 'success' : status === 'failed' ? 'error' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={3}><NotificationOutlined style={{ marginRight: 8 }} /> Notifications</Title>
        <Text type="secondary">View the history of all reminders and alerts sent to your email and phone.</Text>
      </div>

      <Card className="card-shadow" styles={{ body: { padding: isMobile ? 0 : 24 } }}>
        {isMobile ? (
          <List
            dataSource={logs}
            loading={loading}
            renderItem={(item: any) => (
              <List.Item style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>{item.templateType.replace(/_/g, ' ').toUpperCase()}</Text>
                    <Tag color={item.status === 'sent' ? 'success' : item.status === 'failed' ? 'error' : 'warning'}>
                      {item.status.toUpperCase()}
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={4}>
                      {item.channel === 'email' ? <MailOutlined /> : <MessageOutlined />}
                      <Text type="secondary">{item.channel.toUpperCase()}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.sentAt ? dayjs(item.sentAt).format('MMM D, hh:mm A') : 'Pending'}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: <Empty description="No notification history yet." /> }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={logs}
            loading={loading}
            rowKey="id"
            locale={{ emptyText: <Empty description="No notification history yet." /> }}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomerNotifications;
