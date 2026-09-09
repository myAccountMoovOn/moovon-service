import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Result } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const ResellerSignup: React.FC = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  const handleSendOtp = async (email: string, name: string, password: string) => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/register-reseller-step1', {
        name: name,
        email: email,
        password: password,
        companyName: name + ' Agency', // Defaulting as per DTO requirement
        phone: '0000000000', // Defaulting
      });
      setUserEmail(email);
      message.success(`OTP sent to ${email}`);
      setStep('otp');
      setCountdown(40); // Start 40-second timer
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      if (errorMsg.toLowerCase().includes('email')) {
        form.setFields([{ name: 'email', errors: [errorMsg] }]);
      } else {
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishForm = async (values: any) => {
    await handleSendOtp(values.email, values.name, values.password);
  };

  const onResendOtp = async () => {
    const values = form.getFieldsValue();
    await handleSendOtp(values.email, values.name, values.password);
  };

  const onFinishOtp = async (values: any) => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/register-verify', {
        email: userEmail,
        token: values.otp,
      });
      message.success('Email verified successfully!');
      setStep('success');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Invalid OTP. Please try again.';
      otpForm.setFields([{ name: 'otp', errors: [errorMsg] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F0FDF4' }}>
      <BillJiNavbar hideLogin hideSignUp />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <Card style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.1)' }}>
          {step === 'form' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#064E3B', margin: 0 }}>Join as a Reseller</Title>
                <Text type="secondary">Partner with BillJi and grow your business.</Text>
              </div>

              <Form
                form={form}
                name="reseller_register"
                onFinish={onFinishForm}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="john@example.com" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>

                <Form.Item style={{ marginBottom: '16px' }}>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    Create Reseller Account
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
                  Already have an account?{' '}
                  <span 
                    onClick={() => navigate('/login')} 
                    style={{ color: '#16A34A', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </div>
              </Form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#16A34A', marginBottom: '16px' }} />
                <Title level={3} style={{ color: '#064E3B', margin: 0 }}>Verify Your Email</Title>
                <Text type="secondary">We've sent a 6-digit code to <br /><strong>{userEmail}</strong></Text>
              </div>

              <Form
                form={otpForm}
                name="reseller_otp"
                onFinish={onFinishOtp}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please input the OTP!' }, { len: 6, message: 'OTP must be 6 digits' }]}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Input.OTP length={6} size="large" />
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    Verify & Continue
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Didn't receive the code? </Text>
                  <Button 
                    type="link" 
                    disabled={countdown > 0} 
                    style={{ padding: 0, color: countdown > 0 ? '#94A3B8' : '#16A34A' }} 
                    onClick={onResendOtp}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </Button>
                </div>
              </Form>
            </>
          )}

          {step === 'success' && (
            <Result
              status="success"
              title="Successfully Registered!"
              subTitle="Your reseller account has been verified and created."
              extra={[
                <Button type="primary" key="console" onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}>
                  Go to Dashboard
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

export default ResellerSignup;
