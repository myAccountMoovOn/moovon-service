import React, { useState } from 'react';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined, BankOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getCompanySlug } from '../../utils/slug';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const LoginCard: React.FC = () => {
  const navigate = useNavigate();
  const { setFallbackUser } = useAuth();

  const [step, setStep] = useState<0 | 1>(0); // 0 = Email/Password, 1 = OTP Step
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form] = Form.useForm();

  const hostname = window.location.hostname;
  const isResellerDomain = hostname.startsWith('reseller.');
  const isReseller = isResellerDomain;
  const isCompanyDomain = hostname.startsWith('company.');
  const portal = isResellerDomain ? 'reseller' : (isCompanyDomain ? 'company' : 'main');
  const primaryColor = isResellerDomain ? '#16A34A' : '#155EEF';

  // Handlers for Login Submit
  const handleLoginSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
        portal,
      });

      if (res.data?.data?.requireOtp || res.data?.requireOtp) {
        setEmail(values.email);
        setStep(1);
        setSuccess(`Verification OTP code sent to ${values.email}`);
      } else if (res.data?.data?.session || res.data?.session) {
        // Direct session response if OTP disabled
        const session = res.data?.data?.session || res.data?.session;
        const backendUser = res.data?.data?.user || res.data?.user;
        const rawRole = (backendUser?.role || 'customer').toString().toLowerCase();
        
        let mappedRole: 'admin' | 'company' | 'customer' | 'reseller' | 'provider' = 'customer';
        if (rawRole === 'super_admin' || rawRole === 'admin') {
          mappedRole = 'admin';
        } else if (rawRole === 'reseller') {
          mappedRole = 'reseller';
        } else if (rawRole === 'provider' || rawRole === 'company' || isCompanyDomain) {
          mappedRole = 'company';
        }

        if (backendUser) {
          setFallbackUser(backendUser, mappedRole);
        }
        
        const userSlug = getCompanySlug(backendUser);

        if (mappedRole === 'company' || isCompanyDomain) {
          navigate(`/${userSlug}/dashboard`, { replace: true });
        } else if (isResellerDomain || mappedRole === 'reseller') {
          navigate(`/${userSlug}/dashboard`, { replace: true });
        } else if (mappedRole === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
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
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        token: typeof values.otp === 'string' ? values.otp.trim() : values.otp,
        portal,
      });

      const { session, user: backendUser } = res.data?.data || res.data || {};
      const rawRole = (backendUser?.role || 'customer').toString().toLowerCase();

      let mappedRole: 'admin' | 'company' | 'customer' | 'reseller' | 'provider' = 'customer';
      if (rawRole === 'super_admin' || rawRole === 'admin') {
        mappedRole = 'admin';
      } else if (rawRole === 'reseller') {
        mappedRole = 'reseller';
      } else if (rawRole === 'provider' || rawRole === 'company' || isCompanyDomain) {
        mappedRole = 'company';
      }

      if (backendUser) {
        setFallbackUser(backendUser, mappedRole);
      }

      const userSlug = getCompanySlug(backendUser);

      if (mappedRole === 'company' || isCompanyDomain) {
        navigate(`/${userSlug}/dashboard`, { replace: true });
      } else if (isResellerDomain || mappedRole === 'reseller') {
        navigate(`/${userSlug}/dashboard`, { replace: true });
      } else if (mappedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Social Logins disabled temporarily during HttpOnly cookie refactor
  /*
  const handleGoogleLogin = async () => { ... }
  const handleMicrosoftLogin = async () => { ... }
  */

  return (
    <div
      id="login-card-section"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(0,0,0,0.02)',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px',
          }}
        >
          Welcome to BillJi
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
          Login to your account and keep your business moving.
        </p>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px', borderRadius: '8px' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginBottom: '20px', borderRadius: '8px' }} />}

      {step === 0 ? (
        /* Step 0: Email & Password */
        <Form form={form} layout="vertical" onFinish={handleLoginSubmit} requiredMark={false}>
          {/* Email Address */}
          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Email Address</span>}
            name="email"
            rules={[
              { required: true, message: 'Email address is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
            style={{ marginBottom: '18px' }}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="you@company.com"
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              placeholder="Enter your password"
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '14px',
                border: '1px solid #CBD5E1',
              }}
            />
          </Form.Item>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '22px' }}>
            <span
              onClick={() => navigate('/forgot-password')}
              style={{
                color: primaryColor,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isReseller ? '0 4px 12px rgba(22, 163, 74, 0.25)' : '0 4px 12px rgba(21, 94, 239, 0.25)',
              border: 'none',
            }}
          >
            {loading ? 'Logging in...' : 'Login'} <ArrowRightOutlined />
          </Button>
        </Form>
      ) : (
        /* Step 1: 2FA OTP Code Verification */
        <Form layout="vertical" onFinish={handleVerifyOtp}>
          <Form.Item
            label={<span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>Enter 6-Digit OTP Code</span>}
            name="otp"
            rules={[{ required: true, len: 6, message: 'Enter the 6-digit code' }]}
          >
            <Input.OTP length={6} size="large" style={{ display: 'flex', justifyContent: 'center' }} />
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
              boxShadow: isReseller ? '0 4px 12px rgba(22, 163, 74, 0.25)' : '0 4px 12px rgba(21, 94, 239, 0.25)',
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP & Continue'}
          </Button>
          <Button
            type="link"
            block
            onClick={() => setStep(0)}
            style={{ marginTop: '10px', color: '#64748B', fontSize: '13px' }}
          >
            Back to Login
          </Button>
        </Form>
      )}

      {/* Social Logins Temporarily Disabled 
      <Divider plain style={{ color: '#94A3B8', fontSize: '12px', margin: '24px 0 20px 0' }}>
        OR
      </Divider>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px' }}>
        ... Google/Microsoft buttons ...
      </div>
      */}

      {/* Sign Up Link */}
      <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
        <span>Don't have an account? </span>
        <span
          onClick={() => navigate('/signup')}
          style={{ color: primaryColor, fontWeight: 700, cursor: 'pointer' }}
        >
          Sign Up
        </span>
      </div>


    </div>
  );
};

export default LoginCard;
