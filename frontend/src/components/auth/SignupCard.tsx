import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert, Divider, Select } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, ArrowRightOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../api/supabaseClient';
import { getStorageKey } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const SignupCard: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<0 | 1>(0); // 0 = Signup Form, 1 = OTP Verification
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Handlers for Registration Submit
  const handleSignupSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!values.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register-customer-step1`, {
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
      });

      setEmail(values.email);
      setName(values.name);
      setPhone(values.phone);
      setStep(1);
      setSuccess(`Verification code sent to ${values.email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handler for OTP Verification
  const handleVerifyOtp = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/register-verify`, {
        email,
        token: values.otp,
      });

      // Store user signup details locally fallback
      const newUser = {
        email,
        name,
        phone,
        role: 'customer',
      };
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));
      localStorage.setItem(getStorageKey('role'), 'customer');

      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) {
        setError(error.message || 'Google authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to Google authentication');
    } finally {
      setLoading(false);
    }
  };

  // Microsoft OAuth Handler
  const handleMicrosoftLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/login`,
          scopes: 'email profile',
        },
      });
      if (error) {
        setError(error.message || 'Microsoft authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to Microsoft authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="signup-card-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(0,0,0,0.02)',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px',
          }}
        >
          Create Your BillJi Account
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
          Join thousands of businesses already using BillJi.
        </p>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginBottom: '18px', borderRadius: '8px' }} />}

      {step === 0 ? (
        /* Step 0: Registration Form */
        <Form form={form} layout="vertical" onFinish={handleSignupSubmit} requiredMark={false}>
          {/* Full Name */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="Enter your full name"
              style={{
                height: '46px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Email Address */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </span>
            }
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
            style={{ marginBottom: '16px' }}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="you@company.com"
              style={{
                height: '46px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Mobile Number with Country Code */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                Mobile Number <span style={{ color: '#EF4444' }}>*</span>
              </span>
            }
            name="phone"
            rules={[{ required: true, message: 'Please enter your mobile number' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input
              prefix={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
                  <PhoneOutlined style={{ color: '#94A3B8' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>🇮🇳 +91</span>
                </div>
              }
              placeholder="Enter your mobile number"
              style={{
                height: '46px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </span>
            }
            name="password"
            rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="Create a strong password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              style={{
                height: '46px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label={
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </span>
            }
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password' }]}
            style={{ marginBottom: '18px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="Confirm your password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              style={{
                height: '46px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Terms Agreement Checkbox */}
          <Form.Item name="agreeTerms" valuePropName="checked" style={{ marginBottom: '20px' }}>
            <Checkbox style={{ fontSize: '13px', color: '#475569' }}>
              I agree to the{' '}
              <a href="#" style={{ color: '#155EEF', fontWeight: 600 }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: '#155EEF', fontWeight: 600 }}>
                Privacy Policy
              </a>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#155EEF',
              fontSize: '15px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(21, 94, 239, 0.25)',
              border: 'none',
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'} <ArrowRightOutlined />
          </Button>
        </Form>
      ) : (
        /* Step 1: OTP Verification */
        <Form layout="vertical" onFinish={handleVerifyOtp}>
          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Enter 6-Digit OTP Code</span>}
            name="otp"
            rules={[{ required: true, len: 6, message: 'Enter the 6-digit code' }]}
          >
            <Input
              placeholder="123456"
              maxLength={6}
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '8px',
                border: '1px solid #CBD5E1',
              }}
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
              backgroundColor: '#155EEF',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP & Complete Sign Up'}
          </Button>
          <Button
            type="link"
            block
            onClick={() => setStep(0)}
            style={{ marginTop: '10px', color: '#64748B', fontSize: '13px' }}
          >
            Back to Sign Up Form
          </Button>
        </Form>
      )}

      {/* Divider */}
      <Divider plain style={{ color: '#94A3B8', fontSize: '12px', margin: '20px 0 18px 0' }}>
        OR
      </Divider>

      {/* Social Logins */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            flex: 1,
            height: '44px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '13px',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Continue with Microsoft */}
        <button
          type="button"
          onClick={handleMicrosoftLogin}
          style={{
            flex: 1,
            height: '44px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '13px',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          <span>Continue with Microsoft</span>
        </button>
      </div>

      {/* Login Link Footer */}
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
        <span>Already have an account? </span>
        <span
          onClick={() => navigate('/login')}
          style={{ color: '#155EEF', fontWeight: 700, cursor: 'pointer' }}
        >
          Login here
        </span>
      </div>
    </div>
  );
};

export default SignupCard;
