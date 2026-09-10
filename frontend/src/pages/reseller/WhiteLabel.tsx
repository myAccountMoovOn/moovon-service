import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Typography, Upload, Badge, Divider, Space } from 'antd';
import { UploadOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const PRIMARY_COLOR = '#16A34A';

const WhiteLabel: React.FC = () => {
  const [appName, setAppName] = useState('Billji Enterprise');
  const [primaryColor, setPrimaryColor] = useState(PRIMARY_COLOR);
  const [domain, setDomain] = useState('app.yourbrand.com');

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>White Label</Title>
          <Text type="secondary">Customize the platform appearance to match your brand.</Text>
        </div>
        <Button type="primary" style={{ backgroundColor: PRIMARY_COLOR }}>Save Changes</Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Brand Identity */}
            <Card title="Brand Identity" style={{ borderRadius: '12px' }}>
              <Form layout="vertical">
                <Form.Item label="App Name">
                  <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
                </Form.Item>
                <Form.Item label="Tagline">
                  <Input defaultValue="Simplified Billing Solutions" />
                </Form.Item>
                <Form.Item label="Logo">
                  <Upload>
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Card>

            {/* Colors */}
            <Card title="Colors" style={{ borderRadius: '12px' }}>
              <Form layout="vertical">
                <Form.Item label="Primary Color">
                  <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '100px', padding: 0 }} />
                </Form.Item>
                <Form.Item label="Accent Color">
                  <Input type="color" defaultValue="#ffffff" style={{ width: '100px', padding: 0 }} />
                </Form.Item>
              </Form>
            </Card>

            {/* Domain */}
            <Card title="Custom Domain" style={{ borderRadius: '12px' }}>
              <Form layout="vertical">
                <Form.Item label="Domain Name">
                  <Input.Group compact>
                    <Input value={domain} onChange={(e) => setDomain(e.target.value)} style={{ width: 'calc(100% - 100px)' }} />
                    <Button type="primary" style={{ backgroundColor: '#1890ff' }}>Verify</Button>
                  </Input.Group>
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <SafetyCertificateOutlined style={{ color: PRIMARY_COLOR, fontSize: '20px' }} />
                  <Text strong>SSL Status:</Text>
                  <Badge status="success" text={<Text style={{ color: PRIMARY_COLOR }}>Active</Text>} />
                </div>
              </Form>
            </Card>
          </Space>
        </Col>

        {/* Live Preview */}
        <Col xs={24} lg={12}>
          <Card title="Live Preview" style={{ borderRadius: '12px', height: '100%', backgroundColor: '#f0f2f5' }} bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '400px', 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Fake Sidebar/Header */}
              <div style={{ height: '60px', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', padding: '0 20px', color: 'white' }}>
                <Title level={4} style={{ color: 'white', margin: 0 }}>{appName}</Title>
              </div>
              <div style={{ display: 'flex', height: '400px' }}>
                <div style={{ width: '80px', backgroundColor: '#f9fafb', borderRight: '1px solid #f0f0f0' }}></div>
                <div style={{ padding: '20px', flex: 1 }}>
                  <div style={{ height: '24px', width: '150px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '20px' }}></div>
                  <div style={{ height: '120px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '12px' }}></div>
                  <div style={{ height: '120px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px' }}></div>
                  <Button type="primary" style={{ backgroundColor: primaryColor, marginTop: '20px' }}>Primary Action</Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WhiteLabel;
