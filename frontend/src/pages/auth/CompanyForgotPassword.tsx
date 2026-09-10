import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Result, Alert, Steps } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined, EyeOutlined, EyeInvisibleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const CompanyForgotPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0); // 0 = Email, 1 = OTP & New Pass, 2 = Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [emailForm] = Form.useForm();
  const [resetForm] = Form.useForm();
  const navigate = useNavigate();

  // Step 0: Submit Email to request OTP
  const handleRequestOtp = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: values.email,
      });

      setUserEmail(values.email);
      setSuccess(`A 6-digit verification code has been sent to ${values.email}`);
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Submit OTP and New Password
  const handleResetPassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const otpValue = typeof values.otp === 'string' ? values.otp : (values.otp?.join('') || values.otp);
      await axios.post(`${API_URL}/auth/reset-password`, {
        email: userEmail,
        token: otpValue,
        newPassword: values.newPassword,
      });

      message.success('Password updated successfully!');
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password. Please check your verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!userEmail) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: userEmail,
      });
      message.success(`A new verification code was sent to ${userEmail}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <BillJiNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <Card style={{ width: '100%', maxWidth: '480px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(20, 104, 232, 0.08)' }}>
          {currentStep < 2 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#071A3D', margin: '0 0 6px 0' }}>Company Account Recovery</Title>
                <Text type="secondary">Reset your password to regain access to your enterprise workspace.</Text>
              </div>

              <Steps current={currentStep} style={{ marginBottom: '28px' }} items={[
                { title: 'Request' },
                { title: 'Reset Password' }
              ]} />
            </>
          )}

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}
          {success && <Alert message={success} type="success" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}

          {/* Step 0: Enter Email */}
          {currentStep === 0 && (
            <Form form={emailForm} layout="vertical" onFinish={handleRequestOtp} size="large">
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Company Work Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter your work email' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
                style={{ marginBottom: '20px' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
                  placeholder="name@company.com"
                  style={{ height: '48px', borderRadius: '8px' }}
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
                  backgroundColor: '#1468E8',
                  borderColor: '#1468E8',
                  fontSize: '15px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(20, 104, 232, 0.2)',
                  marginBottom: '16px',
                }}
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Button
                  type="link"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/login')}
                  style={{ color: '#64748B', fontSize: '13px' }}
                >
                  Back to Login
                </Button>
              </div>
            </Form>
          )}

          {/* Step 1: Verify OTP & Enter New Password */}
          {currentStep === 1 && (
            <Form form={resetForm} layout="vertical" onFinish={handleResetPassword} size="large">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#1468E8', marginBottom: '12px' }} />
                <Text type="secondary">Enter the 6-digit code sent to <strong>{userEmail}</strong></Text>
              </div>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>6-Digit Verification Code</span>}
                name="otp"
                rules={[{ required: true, message: 'Please enter the verification code' }]}
                style={{ marginBottom: '18px' }}
              >
                <Input.OTP length={6} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>New Password</span>}
                name="newPassword"
                rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
                style={{ marginBottom: '18px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
                  placeholder="Enter new password"
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  style={{ height: '48px', borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Confirm New Password</span>}
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your new password' }]}
                style={{ marginBottom: '24px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
                  placeholder="Confirm new password"
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  style={{ height: '48px', borderRadius: '8px' }}
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
                  backgroundColor: '#1468E8',
                  borderColor: '#1468E8',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                {loading ? 'Updating Password...' : 'Reset Password & Continue'}
              </Button>

              <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                <Button type="link" onClick={() => setCurrentStep(0)} style={{ color: '#64748B', padding: 0 }}>
                  Change Email
                </Button>
                <Button type="link" onClick={handleResendOtp} style={{ color: '#1468E8', padding: 0 }}>
                  Resend Code
                </Button>
              </div>
            </Form>
          )}

          {/* Step 2: Success */}
          {currentStep === 2 && (
            <Result
              status="success"
              title="Password Reset Complete!"
              subTitle="Your password has been successfully updated. You can now login to your company workspace."
              extra={[
                <Button
                  type="primary"
                  key="login"
                  onClick={() => navigate('/login')}
                  style={{ backgroundColor: '#1468E8', borderColor: '#1468E8', height: '44px', borderRadius: '8px', fontWeight: 600 }}
                >
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

export default CompanyForgotPassword;
