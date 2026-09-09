import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Steps, message, Upload, Result } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BankOutlined, PhoneOutlined, GlobalOutlined, UploadOutlined, SafetyCertificateOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

const { Title, Text } = Typography;

const CompanySignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  const onNext = async () => {
    try {
      await form.validateFields(['name', 'companyName', 'email', 'password']);
      setUserEmail(form.getFieldValue('email'));
      setCurrentStep(1);
    } catch (error) {
      // Validation failed
    }
  };

  const onPrev = () => {
    setCurrentStep(0);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    message.success(`OTP sent to ${userEmail}`);
    setCurrentStep(2); // Go to OTP step
  };

  const onFinishOtp = (values: any) => {
    console.log('Received OTP: ', values);
    message.success('Email verified successfully!');
    setCurrentStep(3); // Go to Success
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <BillJiNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <Card style={{ width: '100%', maxWidth: '550px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(20, 104, 232, 0.1)' }}>
          {currentStep < 3 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#071A3D', margin: 0 }}>Register Your Company</Title>
                <Text type="secondary">Set up your enterprise workspace on BillJi.</Text>
              </div>

              <Steps current={currentStep} style={{ marginBottom: '32px' }} items={[
                { title: 'Account' },
                { title: 'Profile' },
                { title: 'Verify' }
              ]} />
            </>
          )}

          {currentStep < 2 && (
            <Form
              form={form}
              name="company_register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              {/* Step 1: Account Information */}
              <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                <Form.Item name="name" label="Your Name" rules={[{ required: true, message: 'Please input your name!' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Jane Doe" />
                </Form.Item>

                <Form.Item name="companyName" label="Company Name" rules={[{ required: true, message: 'Please input your company name!' }]}>
                  <Input prefix={<BankOutlined />} placeholder="Acme Corporation" />
                </Form.Item>

                <Form.Item name="email" label="Work Email" rules={[
                  { type: 'email', message: 'The input is not valid E-mail!' },
                  { required: true, message: 'Please input your E-mail!' }
                ]}>
                  <Input prefix={<MailOutlined />} placeholder="jane@acme.com" />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={onNext} block style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
                    Next Step
                  </Button>
                </Form.Item>
              </div>

              {/* Step 2: Company Profile (Optional White-label Settings) */}
              <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E40AF', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <InfoCircleOutlined style={{ fontSize: '16px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong>Optional Profile Info:</strong> Logo, address, and custom domain are optional right now. You can easily add and manage your white-label brand settings anytime after login from Brand Settings.
                  </div>
                </div>

                <Form.Item name="logo" label="Company Logo (Optional)">
                  <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Click to Upload Logo</Button>
                  </Upload>
                </Form.Item>

                <Form.Item name="address" label="Company Address (Optional)">
                  <Input.TextArea placeholder="123 Business Avenue, Suite 100..." rows={3} />
                </Form.Item>

                <Form.Item name="contact" label="Contact Number (Optional)">
                  <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 000-0000" />
                </Form.Item>

                <Form.Item name="domain" label="Company Domain (Optional)">
                  <Input prefix={<GlobalOutlined />} placeholder="acme.com" />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button onClick={onPrev} style={{ flex: 1, height: '48px', fontSize: '16px' }}>
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" style={{ flex: 1, backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
                    Verify Email
                  </Button>
                </div>
              </div>
            </Form>
          )}

          {currentStep === 2 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#1468E8', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#071A3D', margin: 0 }}>Verify Your Email</Title>
                <Text type="secondary">We've sent a 6-digit code to <br /><strong>{userEmail}</strong></Text>
              </div>

              <Form
                form={otpForm}
                name="company_otp"
                onFinish={onFinishOtp}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please input the OTP!' }, { len: 6, message: 'OTP must be 6 digits' }]}
                >
                  <Input.OTP length={6} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
                    Verify & Create Account
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Didn't receive the code? </Text>
                  <Button type="link" style={{ padding: 0, color: '#1468E8' }} onClick={() => message.success(`New OTP sent to ${userEmail}`)}>
                    Resend OTP
                  </Button>
                </div>
              </Form>
            </>
          )}

          {currentStep === 3 && (
            <Result
              status="success"
              title="Company Registered!"
              subTitle="Your enterprise workspace has been successfully verified. You can update your white-label logo and domain settings after login."
              extra={[
                <Button type="primary" key="console" onClick={() => navigate('/login')} style={{ backgroundColor: '#1468E8', borderColor: '#1468E8' }}>
                  Go to Login
                </Button>
              ]}
            />
          )}
        </Card>
      </div>
      <BillJiFooter />
    </div>
  );
};

export default CompanySignup;
