import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Typography, Result, Space, App } from 'antd';
import { CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

import { useQueryClient } from '@tanstack/react-query';

const MockPayment: React.FC = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const subId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/payments/simulate-mock-success/${subId}`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setPaid(true);
      message.success('Payment Successful!');
    } catch (err) {
      message.error('Mock payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
        <Result
          status="success"
          title="Payment Successful!"
          subTitle="Thank you for your payment. Your subscription is now active."
          extra={[
            <Button type="primary" key="home" onClick={() => window.location.href = '/customer/dashboard'}>
              Go to Dashboard
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <Card style={{ width: 400, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, background: '#1677ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LockOutlined style={{ fontSize: 30, color: 'white' }} />
          </div>
          <Title level={3} style={{ margin: 0 }}>Moovon Secure Pay</Title>
          <Text type="secondary">MOCK PAYMENT GATEWAY</Text>
        </div>

        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <Card size="small" style={{ background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text type="secondary">Order ID</Text>
              <Text strong>{subId?.split('-')[0].toUpperCase()}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Currency</Text>
              <Text strong>INR</Text>
            </div>
          </Card>

          <Button 
            type="primary" 
            size="large" 
            block 
            icon={<CheckCircleOutlined />} 
            onClick={handlePay}
            loading={loading}
            style={{ height: '50px', fontSize: '18px', fontWeight: 'bold' }}
          >
            Pay Now (Simulated)
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              This is a simulation environment. No real money will be charged.
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default MockPayment;
