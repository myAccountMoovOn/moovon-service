import React from 'react';
import { Typography, Button, Card, Row, Col, Space, Divider, Tag } from 'antd';
import { PlusOutlined, CheckCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PlanType {
  id: string;
  name: string;
  price: string;
  cycle: string;
  color: string;
  isPopular?: boolean;
  features: string[];
}

const mockPlans: PlanType[] = [
  {
    id: '1',
    name: 'Starter',
    price: '$49',
    cycle: '/month',
    color: '#8c8c8c',
    features: ['Up to 5 Users', 'Basic CRM Module', '10GB Storage', 'Community Support', '100 Invoices/mo'],
  },
  {
    id: '2',
    name: 'Silver',
    price: '$99',
    cycle: '/month',
    color: '#1890ff',
    features: ['Up to 20 Users', 'Advanced CRM', '50GB Storage', 'Email Support', 'Unlimited Invoices'],
  },
  {
    id: '3',
    name: 'Gold',
    price: '$199',
    cycle: '/month',
    color: '#faad14',
    isPopular: true,
    features: ['Up to 50 Users', 'All Modules Included', '200GB Storage', 'Priority 24/7 Support', 'Custom Domain'],
  },
  {
    id: '4',
    name: 'Platinum',
    price: '$499',
    cycle: '/month',
    color: '#16A34A',
    features: ['Unlimited Users', 'White-labeling', '1TB Storage', 'Dedicated Account Manager', 'Custom API Access'],
  },
];

const PlanBuilder: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Plan Builder</Title>
          <Text type="secondary">Design and configure subscription tiers for your customers.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#16A34A' }}>
          Create New Plan
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {mockPlans.map((plan) => (
          <Col xs={24} sm={12} lg={6} key={plan.id}>
            <Card
              bordered={false}
              style={{
                borderRadius: '12px',
                boxShadow: plan.isPopular ? '0 8px 24px rgba(22, 163, 74, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
                borderTop: `6px solid ${plan.color}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {plan.isPopular && (
                <Tag color="#16A34A" style={{ position: 'absolute', top: '12px', right: '-8px', borderRadius: '4px' }}>
                  Most Popular
                </Tag>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={4} style={{ color: plan.color, marginBottom: '8px' }}>{plan.name}</Title>
                <div>
                  <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{plan.price}</span>
                  <Text type="secondary">{plan.cycle}</Text>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleFilled style={{ color: '#16A34A', marginRight: '8px' }} />
                      <Text>{feature}</Text>
                    </div>
                  ))}
                </Space>
              </div>

              <Divider style={{ margin: '24px 0 16px 0' }} />
              
              <Row gutter={8}>
                <Col span={12}>
                  <Button block icon={<EditOutlined />}>Edit</Button>
                </Col>
                <Col span={12}>
                  <Button block danger icon={<DeleteOutlined />}>Archive</Button>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlanBuilder;
