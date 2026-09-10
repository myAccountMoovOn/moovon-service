import React from 'react';
import { Card, Row, Col, Typography, Button, Badge, Space, Divider, Tag } from 'antd';
import { PlusOutlined, CheckCircleOutlined, DisconnectOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PRIMARY_COLOR = '#16A34A';

const PaymentGateways: React.FC = () => {
  const gateways = [
    {
      id: 1,
      name: 'Razorpay',
      connected: true,
      lastSync: '2 mins ago',
      color: '#0B59A7',
    },
    {
      id: 2,
      name: 'Stripe',
      connected: true,
      lastSync: '1 hour ago',
      color: '#635BFF',
    },
    {
      id: 3,
      name: 'PayU',
      connected: false,
      lastSync: 'N/A',
      color: '#28A745',
    },
    {
      id: 4,
      name: 'PayPal',
      connected: false,
      lastSync: 'N/A',
      color: '#003087',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Payment Gateways</Title>
          <Text type="secondary">Manage your payment processors and integrations.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>
          Add Gateway
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {gateways.map((gw) => (
          <Col xs={24} sm={12} lg={8} key={gw.id}>
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                border: gw.connected ? `1px solid ${PRIMARY_COLOR}` : undefined,
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: gw.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {gw.name.charAt(0)}
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{gw.name}</Title>
                    <div style={{ marginTop: '4px' }}>
                      {gw.connected ? (
                        <Badge status="success" text={<Text type="success" style={{ color: PRIMARY_COLOR }}>Connected</Text>} />
                      ) : (
                        <Badge status="default" text={<Text type="secondary">Not Connected</Text>} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">Last Sync: {gw.lastSync}</Text>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {gw.connected ? (
                  <>
                    <Button icon={<SettingOutlined />} flex="auto">Configure</Button>
                    <Button danger icon={<DisconnectOutlined />} flex="auto">Disconnect</Button>
                  </>
                ) : (
                  <Button type="primary" ghost style={{ width: '100%', borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}>Connect Gateway</Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PaymentGateways;
