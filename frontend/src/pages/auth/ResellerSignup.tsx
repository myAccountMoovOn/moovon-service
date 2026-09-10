import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Result, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const ResellerSignup: React.FC = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(0);


  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
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
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}
          {success && <Alert message={success} type="success" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}

          {step === 'form' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                  Join as a Reseller
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Partner with BillJi and grow your business.
                </p>
              </div>

              <Form
                form={form}
                name="reseller_register"
                onFinish={onFinishForm}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  name="name"
                  label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Full Name</span>}
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />} placeholder="John Doe" size="large" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Email Address</span>}
                  rules={[
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' }
                  ]}
                >
                  <Input prefix={<MailOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />} placeholder="john@example.com" size="large" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Password</span>}
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />} placeholder="••••••••" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    {loading ? 'Sending OTP...' : 'Create Reseller Account'}
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 20px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ padding: '0 12px', color: '#94A3B8', fontSize: '12px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              {/* Social Logins */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1, height: '46px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontWeight: 600, fontSize: '14px', color: '#334155', cursor: 'pointer',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1, height: '46px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontWeight: 600, fontSize: '14px', color: '#334155', cursor: 'pointer',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" /><path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" /><path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
                Already have an account?{' '}
                <span 
                  onClick={() => navigate('/login')} 
                  style={{ color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                >
                  Login
                </span>
              </div>
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
                  rules={[{ required: true, message: 'Please input the OTP!' }]}
                >
                  <Input.OTP length={6} size="large" style={{ display: 'flex', justifyContent: 'center' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
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
