import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0); // 0 = Email, 1 = OTP & New Password
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const hostname = window.location.hostname;
  const isReseller = hostname.startsWith('reseller.');
  const isSubdomain = hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('www.');
  const primaryColor = isReseller ? '#16A34A' : '#155EEF';
  const bgColor = isSubdomain ? (isReseller ? '#F0FDF4' : '#F8FAFC') : '#F7FAFF';

  const handleRequestOtp = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: values.email,
      });
      setEmail(values.email);
      setStep(1);
      message.success(`Password reset OTP sent to ${values.email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        token: typeof values.otp === 'string' ? values.otp.trim() : values.otp,
        newPassword: values.newPassword,
      });
      message.success('Password reset successfully. You can now login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: bgColor }}>
      <BillJiNavbar hideLogin hideSignUp />
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.07)',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '460px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              Reset Password
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              {step === 0 ? "Enter your email to receive a reset code." : "Enter the code and your new password."}
            </p>
          </div>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px', borderRadius: '8px' }} />}

          {step === 0 ? (
            <Form form={form} layout="vertical" onFinish={handleRequestOtp} requiredMark={false}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Email address is required' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
                  placeholder="you@company.com"
                  size="large"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: primaryColor,
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  marginTop: '10px'
                }}
              >
                Send Verification Code
              </Button>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>6-Digit OTP</span>}
                name="otp"
                rules={[{ required: true, len: 6, message: 'Enter the 6-digit code' }]}
              >
                <Input.OTP length={6} size="large" style={{ display: 'flex', justifyContent: 'center' }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>New Password</span>}
                name="newPassword"
                rules={[{ required: true, message: 'Please input your new password!' }, { min: 6, message: 'Must be at least 6 characters' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Confirm Password</span>}
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your new password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: primaryColor,
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  marginTop: '10px'
                }}
              >
                Reset Password
              </Button>
            </Form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#64748B', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ArrowLeftOutlined /> Back to Login
            </span>
          </div>
        </div>
      </div>
      
      <BillJiFooter />
    </div>
  );
};

export default ForgotPassword;
