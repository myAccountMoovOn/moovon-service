import React, { useState } from 'react';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined, BankOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api/supabaseClient';
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
          setFallbackUser(backendUser, mappedRole, session);
        }

        if (session?.access_token) {
          try {
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token || '',
            });
          } catch (e) {
            console.warn('Supabase setSession warning:', e);
          }
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
        setFallbackUser(backendUser, mappedRole, session);
      }

      if (session?.access_token) {
        try {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token || '',
          });
        } catch (e) {
          console.warn('Supabase setSession warning:', e);
        }
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

      {/* Divider */}
      <Divider plain style={{ color: '#94A3B8', fontSize: '12px', margin: '24px 0 20px 0' }}>
        OR
      </Divider>

      {/* Social Logins */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', marginBottom: '24px' }}>
        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            flex: 1,
            height: '46px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {/* Google multicolor G SVG logo */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* Continue with Microsoft */}
        <button
          type="button"
          onClick={handleMicrosoftLogin}
          style={{
            flex: 1,
            height: '46px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '14px',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {/* Microsoft 4-square SVG logo */}
          <svg width="18" height="18" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          <span>Microsoft</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px', color: '#64748B' }}>
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
