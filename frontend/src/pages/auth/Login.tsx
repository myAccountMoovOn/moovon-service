import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';
import { supabase } from '../../api/supabaseClient';

const { Title, Text } = Typography;

const Login: React.FC = () => {
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
      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        const rawRole = data.user.user_metadata?.role || data.user.app_metadata?.role || 'customer';
        const isAdmin = rawRole === 'provider' || rawRole === 'super_admin' || rawRole === 'admin';
        navigate(isAdmin ? '/admin/dashboard' : '/customer/dashboard', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
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
