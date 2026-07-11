import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message, Image, Alert, Tabs, ColorPicker, Select, InputNumber, Row, Col, Card, Divider } from 'antd';
import { 
  BgColorsOutlined, 
  GlobalOutlined, 
  PictureOutlined, 
  MailOutlined, 
  SafetyCertificateOutlined,
  SaveOutlined,
  MobileOutlined
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useBranding } from '../../context/BrandingContext';

const { Title, Text, Paragraph } = Typography;

const BrandSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const { refreshBranding } = useBranding();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get('/companies/me');
        if (res.data) {
          form.setFieldsValue({
            ...res.data,
          });
          setPreviewLogo(res.data.logo || null);
          setPreviewIcon(res.data.appIconUrl || null);
          setCompanyCode(res.data.code || null);
        }
      } catch (e) {
        // may not have company yet
      } finally {
        setFetching(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const primaryColor = typeof values.primaryColor === 'string' ? values.primaryColor : values.primaryColor?.toHexString();
      const accentColor = typeof values.accentColor === 'string' ? values.accentColor : values.accentColor?.toHexString();

      const payload = {
        ...values,
        primaryColor,
        accentColor,
      };

      await axiosInstance.patch('/companies/me', payload);
      setPreviewLogo(values.logo || null);
      setPreviewIcon(values.appIconUrl || null);
      message.success('Brand settings saved successfully!');
      
      await refreshBranding();
    } catch (e: any) {
      message.error(e.response?.data?.message || 'Failed to save brand settings');
    } finally {
      setLoading(false);
    }
  };

  const TabVisual = (
    <Row gutter={[32, 32]}>
      <Col xs={24} lg={14}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="Your company name" size="large" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="appName" label="App Name" extra="Browser & mobile app title">
                <Input placeholder="e.g. AquaTrack" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="tagline" label="Tagline" extra="Catchphrase for login screens">
                <Input placeholder="e.g. Never miss a renewal" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={12} sm={8}>
              <Form.Item name="primaryColor" label="Primary Color">
                <ColorPicker showText size="large" />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Item name="accentColor" label="Accent Color">
                <ColorPicker showText size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="fontFamily" label="Font Family">
                <Select size="large" options={[
                  { label: 'System Default', value: '' },
                  { label: 'Inter', value: 'Inter' },
                  { label: 'Roboto', value: 'Roboto' },
                  { label: 'Outfit', value: 'Outfit' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="logo" label="Primary Logo URL" extra="Direct link to your logo (PNG/SVG with transparent background)">
            <Input placeholder="https://example.com/logo.png" size="large" onChange={(e) => setPreviewLogo(e.target.value || null)} />
          </Form.Item>
          <Form.Item name="favicon" label="Favicon URL" extra="Square icon for the browser tab (ICO/PNG, 32x32px)">
            <Input placeholder="https://example.com/favicon.ico" size="large" />
          </Form.Item>
        </div>
      </Col>
      <Col xs={24} lg={10}>
        <Card size="small" title={<><PictureOutlined /> Logo Preview</>} style={{ background: '#f8f9fa', borderColor: '#e9ecef' }}>
          {previewLogo ? (
            <div style={{ padding: 32, background: 'white', borderRadius: 8, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Image src={previewLogo} alt="Logo" style={{ maxHeight: 100, objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ padding: 60, textAlign: 'center', color: '#adb5bd', background: 'white', borderRadius: 8, border: '1px dashed #dee2e6' }}>
              <PictureOutlined style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }} />
              <Paragraph style={{ color: '#adb5bd', margin: 0 }}>Enter a logo URL to see preview</Paragraph>
            </div>
          )}
          
          <Divider style={{ margin: '24px 0' }} />
          
          <Text type="secondary" style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Pro tip:</span> Use a transparent PNG or SVG for the best results across light and dark themes. We recommend a maximum height of 120px.
          </Text>
        </Card>
      </Col>
    </Row>
  );

  const TabDomain = (
    <Row gutter={[32, 32]}>
      <Col xs={24} lg={14}>
        <Form.Item name="customDomain" label={<><GlobalOutlined style={{ marginRight: 6 }} />Custom Domain (Web App)</>} extra="Point a CNAME record from your domain to portal.moovon.app">
          <Input placeholder="portal.yourdomain.com" size="large" addonBefore="https://" />
        </Form.Item>
        
        <Divider />
        
        <Title level={5}>Mobile App Branding</Title>
        <Form.Item name="appIconUrl" label={<><MobileOutlined style={{ marginRight: 6 }} />Mobile App Icon URL</>} extra="Square image for the mobile app icon (PNG, 1024x1024px recommended)">
          <Input placeholder="https://example.com/app-icon.png" size="large" onChange={(e) => setPreviewIcon(e.target.value || null)} />
        </Form.Item>
      </Col>
      
      <Col xs={24} lg={10}>
        <Card size="small" title="Icon Preview" style={{ background: '#f8f9fa', borderColor: '#e9ecef' }}>
          {previewIcon ? (
            <div style={{ padding: 32, display: 'flex', justifyContent: 'center', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 120, height: 120, borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Image src={previewIcon} alt="App Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#adb5bd', background: 'white', borderRadius: 8, border: '1px dashed #dee2e6' }}>
              <div style={{ width: 80, height: 80, borderRadius: 16, border: '2px dashed #dee2e6', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MobileOutlined style={{ fontSize: 32, opacity: 0.5 }} />
              </div>
              <Paragraph style={{ color: '#adb5bd', margin: 0 }}>Enter an icon URL to preview</Paragraph>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );

  const TabEmail = (
    <div style={{ maxWidth: 800 }}>
      <Alert 
        type="info" 
        message={<span style={{ fontWeight: 600 }}>Custom SMTP Server</span>} 
        description="Configure your own SMTP server so emails sent to your customers (like OTP verification and renewal reminders) come directly from your email address instead of ours." 
        showIcon 
        style={{ marginBottom: 32, borderRadius: 8, border: '1px solid #91caff' }} 
      />
      
      <Row gutter={16}>
        <Col xs={24} sm={16}>
          <Form.Item name="smtpHost" label="SMTP Host">
            <Input placeholder="smtp.gmail.com" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="smtpPort" label="SMTP Port">
            <InputNumber placeholder="587" size="large" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="smtpUser" label="SMTP Username">
            <Input placeholder="billing@yourdomain.com" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="smtpPass" label="SMTP Password" extra="Leave blank if you don't want to change it. Passwords are encrypted.">
            <Input.Password placeholder="********" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      
      <Title level={5} style={{ marginBottom: 16 }}>Sender Details</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="smtpFromName" label="From Name (Sender)">
            <Input placeholder="AquaTrack Billing" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="smtpFromEmail" label="From Email Address">
            <Input placeholder="no-reply@yourdomain.com" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="emailHeaderLogo" label="Email Header Logo URL" extra="Used at the top of emails. Leave blank to use your Primary Logo.">
        <Input placeholder="https://example.com/email-logo.png" size="large" />
      </Form.Item>
    </div>
  );

  const TabLegal = (
    <div style={{ maxWidth: 800 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Support Information</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="supportEmail" label="Support Email">
            <Input placeholder="support@yourdomain.com" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="supportPhone" label="Support Phone">
            <Input placeholder="+91 98765 43210" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Title level={5} style={{ marginBottom: 16 }}>Legal Links</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="privacyPolicyUrl" label="Privacy Policy URL">
            <Input placeholder="https://yourdomain.com/privacy" size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="termsUrl" label="Terms of Service URL">
            <Input placeholder="https://yourdomain.com/terms" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="footerText" label="Footer Text" extra="Displayed at the bottom of the portal and emails">
        <Input placeholder="© 2025 Your Company. All rights reserved." size="large" />
      </Form.Item>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}><BgColorsOutlined style={{ marginRight: 8 }} />Brand Settings</Title>
          <Text type="secondary">White-label your platform with your company's identity</Text>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          size="large" 
          loading={loading} 
          onClick={() => form.submit()}
          style={{ borderRadius: 8, padding: '0 24px' }}
        >
          Save Changes
        </Button>
      </div>

      {companyCode && (
        <Alert 
          type="success" 
          style={{ marginBottom: 24, borderRadius: 8 }} 
          message={<span style={{ fontWeight: 600 }}>Your Company Code: {companyCode}</span>} 
          description="Share this code with your customers so they can register under your brand." 
          showIcon 
        />
      )}

      <div className="card-shadow" style={{ background: 'var(--color-bg-sidebar)', padding: '24px 32px', borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={handleSave} disabled={fetching}>
          <Tabs 
            size="large"
            tabBarStyle={{ marginBottom: 32 }}
            items={[
              { key: '1', label: <span style={{ padding: '0 8px' }}><PictureOutlined /> Visuals</span>, children: TabVisual },
              { key: '2', label: <span style={{ padding: '0 8px' }}><GlobalOutlined /> Domain & App</span>, children: TabDomain },
              { key: '3', label: <span style={{ padding: '0 8px' }}><MailOutlined /> Email Config</span>, children: TabEmail },
              { key: '4', label: <span style={{ padding: '0 8px' }}><SafetyCertificateOutlined /> Legal & Support</span>, children: TabLegal },
            ]} 
          />
        </Form>
      </div>
    </div>
  );
};

export default BrandSettings;
