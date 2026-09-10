import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Steps, message, Upload, Result } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BankOutlined, PhoneOutlined, GlobalOutlined, UploadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const CompanySignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, countdown]);

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

  const handleSendOtp = async (values: any) => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/register-provider-step1', {
        name: values.name,
        companyName: values.companyName,
        email: values.email,
        password: values.password,
        phone: values.contact || '0000000000', // Map contact to phone for DTO
        // address, domain, logo etc. can be updated later via profile API
      });
      message.success(`OTP sent to ${values.email}`);
      setCurrentStep(2); // Go to OTP step
      setCountdown(40); // Start 40-second timer
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      if (errorMsg.toLowerCase().includes('email')) {
        // Since we are in step 1 here, we need to go back to step 0 if the error is about email
        setCurrentStep(0);
        form.setFields([{ name: 'email', errors: [errorMsg] }]);
      } else {
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    await handleSendOtp(values);
  };

  const onResendOtp = async () => {
    const values = form.getFieldsValue();
    await handleSendOtp(values);
  };

  const onFinishOtp = async (values: any) => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/register-verify', {
        email: userEmail,
        token: values.otp,
      });
      message.success('Email verified successfully!');
      setCurrentStep(3); // Go to Success
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Invalid OTP. Please try again.';
      otpForm.setFields([{ name: 'otp', errors: [errorMsg] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <BillJiNavbar hideLogin hideSignUp />
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

                <Form.Item style={{ marginBottom: '16px' }}>
                  <Button type="primary" onClick={onNext} block style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
                    Next Step
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
                  Already have an account?{' '}
                  <span 
                    onClick={() => navigate('/login')} 
                    style={{ color: '#1468E8', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </div>
              </div>

              <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <Form.Item name="logo" label="Company Logo">
                  <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item name="address" label="Company Address" rules={[{ required: true, message: 'Please input company address!' }]}>
                  <Input.TextArea placeholder="123 Business Avenue, Suite 100..." rows={3} />
                </Form.Item>

                <Form.Item name="contact" label="Contact Number" rules={[{ required: true, message: 'Please input contact number!' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="+1 (555) 000-0000" />
                </Form.Item>

                <Form.Item name="domain" label="Company Domain" rules={[{ required: true, message: 'Please input company domain!' }]}>
                  <Input prefix={<GlobalOutlined />} placeholder="acme.com" />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Button onClick={onPrev} style={{ flex: 1, height: '48px', fontSize: '16px' }}>
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 1, backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
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
                  <Input.OTP length={6} size="large" style={{ display: 'flex', justifyContent: 'center' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', height: '48px', fontSize: '16px' }}>
                    Verify & Create Account
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Didn't receive the code? </Text>
                  <Button 
                    type="link" 
                    disabled={countdown > 0} 
                    style={{ padding: 0, color: countdown > 0 ? '#94A3B8' : '#1468E8' }} 
                    onClick={onResendOtp}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </Button>
                </div>
              </Form>
            </>
          )}

          {currentStep === 3 && (
            <Result
              status="success"
              title="Company Registered!"
              subTitle="Your enterprise workspace has been successfully verified."
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
