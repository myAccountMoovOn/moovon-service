import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Result, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

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

  const onFinishForm = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/register-reseller-step1`, {
        email: values.email,
        password: values.password,
        name: values.name,
        agencyName: values.agencyName || values.name,
      });

      setUserEmail(values.email);
      setSuccess(`Verification code sent to ${values.email}`);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onFinishOtp = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const otpValue = typeof values.otp === 'string' ? values.otp : (values.otp?.join('') || '');
      await axios.post(`${API_URL}/auth/register-verify`, {
        email: userEmail,
        token: otpValue,
      });

      message.success('Reseller account verified & created successfully!');
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userEmail) return;
    setLoading(true);
    setError(null);
    try {
      const values = form.getFieldsValue();
      await axios.post(`${API_URL}/auth/register-reseller-step1`, {
        email: userEmail,
        password: values.password,
        name: values.name,
        agencyName: values.agencyName || values.name,
      });
      message.success(`New verification OTP code sent to ${userEmail}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F0FDF4' }}>
      <BillJiNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <Card style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.1)' }}>
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}
          {success && <Alert message={success} type="success" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}

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

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    {loading ? 'Sending OTP...' : 'Create Reseller Account'}
                  </Button>
                </Form.Item>
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
                  rules={[{ required: true, message: 'Please input the OTP!' }]}
                >
                  <Input.OTP length={6} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Didn't receive the code? </Text>
                  <Button type="link" style={{ padding: 0, color: '#16A34A' }} onClick={handleResendOtp}>
                    Resend OTP
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
                <Button type="primary" key="console" onClick={() => navigate('/login')} style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}>
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

export default ResellerSignup;
