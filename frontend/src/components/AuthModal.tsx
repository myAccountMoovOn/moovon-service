import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Tabs, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, ArrowRightOutlined, XOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, getStorageKey } from '../context/AuthContext';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Login states
  const [loginStep, setLoginStep] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  
  // Signup states
  const [signupStep, setSignupStep] = useState(0);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const navigate = useNavigate();
  const { setFallbackUser } = useAuth();
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  if (!isOpen) return null;

  // LOGIN HANDLERS
  const handleLoginSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      if (res.data?.data?.requireOtp) {
        setLoginEmail(values.email);
        setLoginStep(1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerify = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: loginEmail,
        token: values.otp,
      });
      const { session, user: backendUser } = res.data?.data || {};
      const rawRole = backendUser?.role || 'customer';
      const isAdmin = rawRole === 'provider' || rawRole === 'super_admin' || rawRole === 'admin' || rawRole === 'reseller';
      const mappedRole: 'admin' | 'customer' = isAdmin ? 'admin' : 'customer';

      if (backendUser) {
        setFallbackUser(backendUser, mappedRole);
      }

      onClose();
      navigate(mappedRole === 'admin' ? '/admin/dashboard' : '/customer/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP HANDLERS
  const handleSignupSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/register-customer-step1`, {
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
      });
      setSignupName(values.name);
      setSignupPhone(values.phone);
      setSignupEmail(values.email);
      setSignupStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/register-verify`, {
        email: signupEmail,
        token: values.otp,
      });

      // Store user signup details locally
      const newUser = {
        email: signupEmail,
        name: signupName,
        phone: signupPhone,
        role: 'customer',
      };
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));

      setActiveTab('login');
      setSignupStep(0);
      setSuccess('Account created successfully! Please sign in.');
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 18, 64, 0.65)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#ffffff',
          borderRadius: 24,
          padding: '32px 28px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#f4f6fc',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          <XOutlined style={{ fontSize: 16 }} />
        </button>

        {/* Header Tabs */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0, marginBottom: 4, fontWeight: 700 }}>
            {activeTab === 'login' ? 'Welcome back 👋' : 'Create an Account ✨'}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {activeTab === 'login' ? 'Sign in to access your Moovon account' : 'Join Moovon in seconds'}
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as 'login' | 'signup');
            setError(null);
            setSuccess(null);
          }}
          centered
          items={[
            { key: 'login', label: 'Sign In' },
            { key: 'signup', label: 'Sign Up' },
          ]}
          style={{ marginBottom: 20 }}
        />

        {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        {/* SIGN IN FORM */}
        {activeTab === 'login' && (
          loginStep === 0 ? (
            <Form form={loginForm} layout="vertical" onFinish={handleLoginSubmit} size="large">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
              >
                <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Email address" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Password" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 12 }}>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 46, borderRadius: 8, backgroundColor: '#5c3cff', fontWeight: 600 }}>
                  Sign In <ArrowRightOutlined />
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Don't have an account? </Text>
                <Button type="link" onClick={() => { setActiveTab('signup'); setError(null); setSuccess(null); }} style={{ padding: 0, fontWeight: 600, color: '#5c3cff' }}>
                  Sign up
                </Button>
              </div>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleLoginVerify} size="large">
              <Alert type="info" message={`Enter OTP sent to ${loginEmail}`} style={{ marginBottom: 16 }} />
              <Form.Item name="otp" rules={[{ required: true, len: 6, message: 'Enter 6-digit OTP' }]}>
                <Input placeholder="6-digit OTP" maxLength={6} style={{ textAlign: 'center', letterSpacing: 6, fontSize: 18 }} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 46, borderRadius: 8, backgroundColor: '#5c3cff', fontWeight: 600 }}>
                Verify & Continue <ArrowRightOutlined />
              </Button>
            </Form>
          )
        )}

        {/* SIGN UP FORM */}
        {activeTab === 'signup' && (
          signupStep === 0 ? (
            <Form form={signupForm} layout="vertical" onFinish={handleSignupSubmit} size="large">
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Full name required' }]}>
                    <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Full Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone required' }]}>
                    <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="Phone" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="you@example.com" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Min. 6 chars' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Password" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 12 }}>
                <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 46, borderRadius: 8, backgroundColor: '#5c3cff', fontWeight: 600 }}>
                  Create Account
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Already have an account? </Text>
                <Button type="link" onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }} style={{ padding: 0, fontWeight: 600, color: '#5c3cff' }}>
                  Sign in
                </Button>
              </div>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleSignupVerify} size="large">
              <Alert type="success" message="Account Created!" description={`Enter the 6-digit OTP sent to ${signupEmail}.`} style={{ marginBottom: 16 }} />
              <Form.Item name="otp" rules={[{ required: true, len: 6, message: 'Enter 6-digit OTP' }]}>
                <Input placeholder="6-digit OTP" maxLength={6} style={{ textAlign: 'center', letterSpacing: 6, fontSize: 18 }} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 46, borderRadius: 8, backgroundColor: '#5c3cff', fontWeight: 600 }}>
                Verify OTP
              </Button>
            </Form>
          )
        )}

      </div>
    </div>
  );
};
