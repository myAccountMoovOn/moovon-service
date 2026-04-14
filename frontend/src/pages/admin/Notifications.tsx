import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Typography, 
  Select, 
  Grid, 
  Drawer, 
  Space, 
  Flex, 
  Avatar, 
  Divider, 
  Alert, 
  Card,
  Button
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  UserOutlined,
  BulbOutlined,
  ExclamationCircleFilled,
  ReloadOutlined
} from '@ant-design/icons';
import { useNotificationLogs } from '../../hooks/useApi';
import dayjs from 'dayjs';
import type { NotificationLog } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Notifications: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [channel, setChannel] = useState<string | undefined>();
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Detail Drawer State
  const [selectedLog, setSelectedLog] = useState<NotificationLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isLoading, refetch } = useNotificationLogs({ 
    page, 
    limit: 10, 
    status, 
    channel 
  });

  const getChannelIcon = (c: string) => {
    switch (c) {
      case 'email': return <MailOutlined />;
      case 'sms': return <MessageOutlined />;
      case 'whatsapp': return <WhatsAppOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getStatusTag = (s: string) => {
    if (s === 'sent') return <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: '4px' }}>SENT</Tag>;
    if (s === 'failed') return <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: '4px' }}>FAILED</Tag>;
    return <Tag icon={<SyncOutlined spin />} color="processing" style={{ borderRadius: '4px' }}>PENDING</Tag>;
  };

  const openDetails = (log: NotificationLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'time',
      render: (date: string) => dayjs(date).format('MMM D, HH:mm:ss'),
    },
    {
      title: 'Customer',
      dataIndex: 'customerId',
      render: (id: string | null) => id ? <Tag color="blue" style={{ borderRadius: '4px' }}>{id.split('-')[0].toUpperCase()}</Tag> : '-'
    },
    {
      title: 'Type',
      dataIndex: 'templateType',
      render: (type: string) => <Text strong>{type.replace(/_/g, ' ').toUpperCase()}</Text>,
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (c: string) => (
        <Space>
          <Avatar size="small" icon={getChannelIcon(c)} style={{ backgroundColor: '#f0f0f0', color: '#555' }} />
          <Text style={{ fontSize: '12px' }}>{c.toUpperCase()}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => getStatusTag(s),
    },
    {
      title: 'Error Message',
      dataIndex: 'errorMessage',
      responsive: ['lg' as const],
      render: (msg: string) => msg ? <Text type="danger" style={{ fontSize: '12px' }}>{msg}</Text> : '-',
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
        <Title level={2} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px' }}>Notification Logs</Title>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()} size="large" block={isMobile}>Refresh Logs</Button>
      </Flex>
      
      <Card className="card-shadow" style={{ marginBottom: 24, borderRadius: '12px' }} styles={{ body: { padding: isMobile ? '16px' : '20px 24px' } }}>
        <Space orientation={isMobile ? 'vertical' : 'horizontal'} size={16} style={{ width: '100%' }}>
            <div style={{ width: isMobile ? '100%' : 180 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Filter Channel</Text>
                <Select 
                    placeholder="All Channels" 
                    style={{ width: '100%' }} 
                    allowClear 
                    onChange={setChannel}
                    size="large"
                >
                    <Option value="email">Email Service</Option>
                    <Option value="sms">SMS Gateway</Option>
                    <Option value="whatsapp">WhatsApp Business</Option>
                </Select>
            </div>
            <div style={{ width: isMobile ? '100%' : 180 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Audit Status</Text>
                <Select 
                    placeholder="All Stats" 
                    style={{ width: '100%' }} 
                    allowClear 
                    onChange={setStatus}
                    size="large"
                >
                    <Option value="sent">Successfully Sent</Option>
                    <Option value="failed">Failed Delivery</Option>
                    <Option value="pending">Pending Queue</Option>
                </Select>
            </div>
        </Space>
      </Card>

      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          pagination={{
              current: page,
              pageSize: 10,
              total: data?.total,
              onChange: (p) => setPage(p),
          }}
          rowKey="id"
          className="card-shadow"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        />
      ) : (
        <div style={{ marginTop: 8 }}>
            {(data?.data || []).map((item: NotificationLog, index: number) => (
                <div 
                    key={item.id || index}
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
                                style={{ 
                                    backgroundColor: item.channel === 'email' ? '#e6f7ff' : (item.channel === 'whatsapp' ? '#f6ffed' : '#fff0f6'), 
                                    color: item.channel === 'email' ? '#1890ff' : (item.channel === 'whatsapp' ? '#52c41a' : '#eb2f96') 
                                }}
                                icon={getChannelIcon(item.channel)}
                            />
                            <Space orientation="vertical" size={0}>
                                <Text strong style={{ fontSize: '14px' }}>{item.templateType.replace(/_/g, ' ').toUpperCase()}</Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>{dayjs(item.createdAt).format('MMM D, HH:mm')}</Text>
                            </Space>
                        </Flex>
                        {getStatusTag(item.status)}
                    </Flex>
                </div>
            ))}
            {(!data?.data || data.data.length === 0) && !isLoading && (
                <Empty description="No logs found" />
            )}
        </div>
      )}

      {/* Detail Drawer (Mobile) */}
      <Drawer
        title={<Text strong style={{ fontSize: '18px' }}>Log Details</Text>}
        placement="bottom"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '20px', height: '75vh' }, header: { borderBottom: '1px solid #f0f0f0' } }}
      >
        {selectedLog && (
            <Flex vertical gap={24}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Avatar 
                        size={48}
                        style={{ 
                            backgroundColor: selectedLog.channel === 'email' ? '#e6f7ff' : (selectedLog.channel === 'whatsapp' ? '#f6ffed' : '#fff0f6'), 
                            color: selectedLog.channel === 'email' ? '#1890ff' : (selectedLog.channel === 'whatsapp' ? '#52c41a' : '#eb2f96') 
                        }}
                        icon={getChannelIcon(selectedLog.channel)}
                    />
                    <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>AUDIT TIMESTAMP</Text>
                        <Title level={5} style={{ margin: 0 }}>{dayjs(selectedLog.createdAt).format('MMMM D, YYYY - HH:mm:ss')}</Title>
                    </div>
                </div>

                <Divider style={{ margin: 0 }} />

                <Flex vertical gap={16}>
                     <div>
                        <Text type="secondary" style={{ fontSize: '11px' }}><UserOutlined /> RECIPIENT REFERENCE</Text>
                        <Card size="small" style={{ marginTop: 4, background: '#f9f9f9', border: 'none' }}>
                            <Text strong>{selectedLog.customerId || 'System Action'}</Text>
                        </Card>
                    </div>

                    <div>
                        <Text type="secondary" style={{ fontSize: '11px' }}><BulbOutlined /> TEMPLATE TYPE</Text>
                        <Text strong style={{ display: 'block', marginTop: 4 }}>{selectedLog.templateType.replace(/_/g, ' ').toUpperCase()}</Text>
                    </div>

                    <div>
                        <Text type="secondary" style={{ fontSize: '11px' }}><CalendarOutlined /> DELIVERY CHANNEL</Text>
                        <Space style={{ marginTop: 4 }}>
                            <Tag color="default">{selectedLog.channel.toUpperCase()}</Tag>
                            {getStatusTag(selectedLog.status)}
                        </Space>
                    </div>
                </Flex>

                {selectedLog.status === 'failed' && (
                    <Alert
                        title="Delivery Error Detected"
                        description={selectedLog.errorMessage || 'Unknown system error occurred during dispatch.'}
                        type="error"
                        showIcon
                        icon={<ExclamationCircleFilled />}
                        style={{ borderRadius: '12px' }}
                    />
                )}

                {selectedLog.status === 'sent' && (
                    <Alert
                       title="Dispatched Successfully"
                       description="The notification was successfully accepted by the provider gateway."
                       type="success"
                       showIcon
                       style={{ borderRadius: '12px' }}
                    />
                )}
                
                <Button block size="large" onClick={() => setIsDrawerOpen(false)} style={{ height: '54px', borderRadius: '12px', marginTop: 8 }}>
                    Close Log
                </Button>
            </Flex>
        )}
      </Drawer>
    </div>
  );
};

export default Notifications;
