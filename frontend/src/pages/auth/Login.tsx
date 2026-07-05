import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api/supabaseClient';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user, role, isLoading } = useAuth();
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
        message.success('Logged in successfully');
        const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role || 'customer';
        navigate(`/${userRole}/dashboard`, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-sidebar)' }}>
      <Card style={{ width: 400 }} className="card-shadow">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/favicon.svg" alt="Moovon Logo" style={{ height: 80, marginBottom: 16 }} />
          <Title level={3} className="text-primary" style={{ margin: 0 }}>Moovon Service</Title>
          <Text type="secondary">Sign in to your account</Text>
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
              type="password"
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
      </Card>
    </div>
  );
};

export default Login;
