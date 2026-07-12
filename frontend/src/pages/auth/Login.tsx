import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider, Steps } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';
import { supabase } from '../../api/supabaseClient';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const Login: React.FC = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user, role, isLoading } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  if (!isLoading && user) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (res.data?.data?.requireOtp) {
        setEmail(values.email);
        setStep(1);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (values: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        token: values.otp,
      });

      const { session, user: backendUser } = res.data?.data || {};
      if (session) {
        // Hydrate the supabase client with the session so AuthContext detects it
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        const rawRole = backendUser.role || 'customer';
        const isAdmin = rawRole === 'provider' || rawRole === 'super_admin' || rawRole === 'admin' || rawRole === 'reseller';
        navigate(isAdmin ? '/admin/dashboard' : '/customer/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-sidebar)' }}>
      <Card style={{ width: 420 }} className="card-shadow">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {branding?.logo ? (
            <img src={branding.logo} alt="Logo" style={{ maxHeight: 64, objectFit: 'contain', marginBottom: 16 }} />
          ) : null}
          <Title level={3} className="text-primary" style={{ margin: 0 }}>{branding?.appName || 'Moovon Service'}</Title>
          <Text type="secondary">{branding?.tagline || 'Sign in to your account'}</Text>
        </div>

        {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 24 }} />}

        {step === 0 ? (
          <Form name="normal_login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email address' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email address" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={handleVerify}>
            <Alert
              type="info"
              message="Two-Factor Authentication"
              description={`We sent a 6-digit code to ${email}.`}
              style={{ marginBottom: 16 }}
            />
            <Form.Item name="otp" label="Verification Code" rules={[{ required: true, len: 6, message: 'Enter the 6-digit code' }]}>
              <Input placeholder="Enter 6-digit OTP" maxLength={6} size="large" style={{ textAlign: 'center', letterSpacing: 8, fontSize: 18 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Verify & Continue
              </Button>
            </Form.Item>
            <Button type="link" block onClick={() => setStep(0)} disabled={loading}>
              Back to Login
            </Button>
          </Form>
        )}

        <Divider plain>Don't have an account?</Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/signup">
            <Button block size="large">
              Sign up for an Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
