import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, message, Empty, Grid, List, Card } from 'antd';
import { DownloadOutlined, CreditCardOutlined, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosInstance from '../../api/axiosInstance';
import type { Payment } from '../../types';
import { PaymentRecordStatus } from '../../types';

const { Title, Text } = Typography;

const Billing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/payments/history/my-history');
      setPayments(data.data?.payments || data.data || []);
    } catch (err) {
      // Gracefully fallback to empty payments list without intrusive toast messages
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const downloadInvoice = async (paymentId: string) => {
    try {
      const { data } = await axiosInstance.get(`/payments/invoice/${paymentId}`);
      window.open(data.data.url, '_blank');
    } catch (err) {
      message.error('Invoice not available');
    }
  };

  const columns = [
    {
      title: 'Payment Date',
      dataIndex: 'paidAt',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : '-',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      render: (id: string) => id || 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amt: number) => `₹ ${amt}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === PaymentRecordStatus.SUCCESS ? 'success' : 'default'} icon={status === PaymentRecordStatus.SUCCESS ? <CheckCircleFilled /> : null}>
          {(status || '').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Invoice',
      key: 'action',
      render: (_: any, record: Payment) => (
        record.status === PaymentRecordStatus.SUCCESS ? (
          <Button icon={<DownloadOutlined />} size="small" onClick={() => downloadInvoice(record.id)}>Download PDF</Button>
        ) : '-'
      ),
    },
  ];

  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={3}><CreditCardOutlined style={{ marginRight: 8 }} />Billing History</Title>
        <Text type="secondary">View and download your invoices for all past transactions.</Text>
      </div>

      {isMobile ? (
        <List
          dataSource={payments}
          loading={loading}
          renderItem={(record) => (
            <Card 
              className="card-shadow" 
              size="small"
              style={{ marginBottom: 12, borderRadius: 8 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: 'block', fontSize: '14px' }}>{record.transactionId || 'N/A'}</Text>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {record.paidAt ? dayjs(record.paidAt).format('MMM D, YYYY') : '-'}
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={record.status === PaymentRecordStatus.SUCCESS ? 'success' : 'default'} style={{ fontSize: '10px' }}>
                      {(record.status || '').toUpperCase()}
                    </Tag>
                    <Text strong style={{ fontSize: '13px', marginLeft: 8 }}>₹ {record.amount}</Text>
                  </div>
                </div>
                {record.status === PaymentRecordStatus.SUCCESS && (
                  <Button 
                    icon={<DownloadOutlined />} 
                    size="small"
                    onClick={() => downloadInvoice(record.id)}
                  />
                )}
              </div>
            </Card>
          )}
          locale={{ emptyText: <Empty description="No payment history found." /> }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={payments}
          loading={loading}
          rowKey="id"
          locale={{ emptyText: <Empty description="No payment history found." /> }}
        />
      )}
    </div>
  );
};

export default Billing;
