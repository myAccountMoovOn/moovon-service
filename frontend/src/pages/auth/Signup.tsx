import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Steps, Row, Col } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ContactNavbar } from '../Contact/components/ContactNavbar';
import '../Contact/Contact.css';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = '/auth/register-customer-step1';

      await axios.post(`${API_URL}${endpoint}`, {
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
      });
      setEmail(values.email);
      setStep(1);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/register-verify`, {
        email,
        token: values.otp,
      });
      navigate('/login');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-sidebar)', display: 'flex', flexDirection: 'column' }}>
      <ContactNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 20px 40px' }}>
        <Card style={{ width: 500, maxWidth: '100%', borderRadius: 16 }} className="card-shadow">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} className="text-primary" style={{ margin: 0 }}>Create an Account</Title>
            <Text type="secondary">Join Moovon today</Text>
          </div>

          <Steps
            current={step}
            style={{ marginBottom: 24 }}
            size="small"
            items={[
              { title: 'Details' },
              { title: 'Verify' },
            ]}
          />

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

          {step === 0 ? (
            <Form form={form} layout="vertical" onFinish={handleRegister}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your full name' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Your full name" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Phone number" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Min. 6 characters required' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Min. 6 characters" size="large" />
              </Form.Item>

              <Form.Item style={{ marginTop: 12 }}>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleVerify}>
              <Alert
                type="success"
                message="Account created!"
                description={`We sent a 6-digit code to ${email}. Please enter it below to complete registration.`}
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
            </Form>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">Already have an account? </Text>
            <Link to="/login">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
