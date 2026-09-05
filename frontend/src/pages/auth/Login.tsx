import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider, Row, Col, Grid } from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  ArrowRightOutlined, 
  FileTextOutlined, 
  LineChartOutlined, 
  FolderOpenOutlined, 
  PieChartOutlined, 
  SafetyCertificateOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  RiseOutlined, 
  UserOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';
import { supabase } from '../../api/supabaseClient';
import { ContactNavbar } from '../Contact/components/ContactNavbar';
import '../Contact/Contact.css';

const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const Login: React.FC = () => {
  const screens = Grid.useBreakpoint();
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
    <div style={{ minHeight: '100vh', background: '#f4f6fc', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <ContactNavbar />

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, maxWidth: 1400, margin: '100px auto 0', width: '100%', padding: '0 24px 48px', flexWrap: 'wrap' }}>
        
        {/* Left Side (Hero + Cards + Banner) */}
        <div style={{ flex: 1, minWidth: 600 }}>
          
          {/* Hero Row (Text & Image) */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 48, alignItems: 'center' }}>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', padding: '6px 16px', borderRadius: 20, marginBottom: 24, fontSize: 12, fontWeight: 600, color: '#555', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#52c41a', marginRight: 8, fontSize: 10 }}>●</span> Trusted by 1,000+ businesses ✨
              </div>
              
              <Title style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: '#1a1a2e' }}>
                Manage. Track.<br/>Get Paid.<br/><span style={{ color: '#5c3cff' }}>Effortlessly.</span>
              </Title>
              
              <Text style={{ fontSize: 16, color: '#666', display: 'block', lineHeight: 1.6, marginBottom: 32 }}>
                {branding?.appName || 'Moovon'} helps you streamline billing, manage invoices, track payments, and grow cash flow — all in one place.
              </Text>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                 <Button type="primary" size="large" style={{ backgroundColor: '#5c3cff', borderRadius: 8, height: 48, padding: '0 24px', fontWeight: 600, border: 'none' }}>
                   Get Started Free <ArrowRightOutlined />
                 </Button>
                 <Button size="large" style={{ borderRadius: 8, height: 48, padding: '0 24px', fontWeight: 600, color: '#5c3cff', borderColor: '#d9cbfc' }}>
                   Explore Features <PlayCircleOutlined />
                 </Button>
              </div>
              
              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#666', fontWeight: 500 }}>
                 <span><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />No credit card</span>
                 <span><ClockCircleOutlined style={{ color: '#1890ff', marginRight: 6 }} />Setup in minutes</span>
                 <span><CloseCircleOutlined style={{ color: '#722ed1', marginRight: 6 }} />Cancel anytime</span>
              </div>
            </div>

            {/* Dashboard Image */}
            <div style={{ flex: 1.1, display: 'flex', justifyContent: 'center' }}>
               <img src="/dashboard_mockup_highres.jpg" alt="Dashboard Preview" style={{ width: '100%', maxWidth: 550 }} />
            </div>
          </div>

          {/* 4 Feature Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
            <Col xs={12} sm={12} md={6}>
              <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }} bodyStyle={{ padding: 20 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                   <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#5c3cff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <FileTextOutlined style={{ color: '#fff', fontSize: 20 }} />
                   </div>
                   <div>
                     <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 700 }}>Create Invoices</Title>
                     <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.4, display: 'block' }}>Generate professional invoices in seconds.</Text>
                   </div>
                 </div>
                 <ArrowRightOutlined style={{ color: '#5c3cff', marginTop: 16, fontSize: 16 }} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }} bodyStyle={{ padding: 20 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                   <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <LineChartOutlined style={{ color: '#fff', fontSize: 20 }} />
                   </div>
                   <div>
                     <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 700 }}>Track Payments</Title>
                     <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.4, display: 'block' }}>Monitor payments and outstanding balances.</Text>
                   </div>
                 </div>
                 <ArrowRightOutlined style={{ color: '#1890ff', marginTop: 16, fontSize: 16 }} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }} bodyStyle={{ padding: 20 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                   <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <TeamOutlined style={{ color: '#fff', fontSize: 20 }} />
                   </div>
                   <div>
                     <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 700 }}>Manage Clients</Title>
                     <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.4, display: 'block' }}>Keep all your client and billing data organized.</Text>
                   </div>
                 </div>
                 <ArrowRightOutlined style={{ color: '#52c41a', marginTop: 16, fontSize: 16 }} />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }} bodyStyle={{ padding: 20 }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                   <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <PieChartOutlined style={{ color: '#fff', fontSize: 20 }} />
                   </div>
                   <div>
                     <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 13, fontWeight: 700 }}>Smart Reports</Title>
                     <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.4, display: 'block' }}>Get insights with powerful reports & analytics.</Text>
                   </div>
                 </div>
                 <ArrowRightOutlined style={{ color: '#fa8c16', marginTop: 16, fontSize: 16 }} />
              </Card>
            </Col>
          </Row>

          {/* Bottom Banner */}
          <Card style={{ borderRadius: 16, border: 'none', background: '#f8f9fc', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '24px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ marginBottom: 24, color: '#1a1a2e', fontWeight: 700, fontSize: 16 }}>Why businesses love {branding?.appName || 'Moovon'} 💜</Title>
                <Row gutter={[24, 24]}>
                  <Col xs={12} md={6} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                      <ClockCircleOutlined style={{ fontSize: 16, color: '#5c3cff' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2, color: '#1a1a2e' }}>Save Time</Text>
                      <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>Automate billing work.</Text>
                    </div>
                  </Col>
                  <Col xs={12} md={6} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                      <SafetyCertificateOutlined style={{ fontSize: 16, color: '#5c3cff' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2, color: '#1a1a2e' }}>Reduce Errors</Text>
                      <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>Minimize mistakes.</Text>
                    </div>
                  </Col>
                  <Col xs={12} md={6} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                      <RiseOutlined style={{ fontSize: 16, color: '#5c3cff' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2, color: '#1a1a2e' }}>Get Paid Faster</Text>
                      <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>Send reminders easily.</Text>
                    </div>
                  </Col>
                  <Col xs={12} md={6} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                      <LineChartOutlined style={{ fontSize: 16, color: '#5c3cff' }} />
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 2, color: '#1a1a2e' }}>Grow Business</Text>
                      <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.3 }}>Better cash flow.</Text>
                    </div>
                  </Col>
                </Row>
              </div>
              {screens.lg && (
                <div>
                   <div style={{ width: 100, height: 100, backgroundColor: '#f0edff', borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileDoneOutlined style={{ fontSize: 48, color: '#5c3cff' }} />
                   </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side (Login) */}
        <div style={{ width: 400, flexShrink: 0 }}>
          <Card style={{ borderRadius: 24, padding: '32px 16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: 'none' }}>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#5c3cff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <FileTextOutlined style={{ color: 'white', fontSize: 24 }} />
              </div>
              <Title level={3} style={{ margin: 0, marginBottom: 8, fontWeight: 700 }}>Welcome back! 👋</Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Sign in to continue to your account</Text>
            </div>

            {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 24 }} />}

            {step === 0 ? (
              <Form name="normal_login" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Invalid email address' }]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#bfbfbf', marginRight: 8 }} />} placeholder="Email address" style={{ borderRadius: 8, padding: '12px 16px' }} />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                  style={{ marginBottom: 24 }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#bfbfbf', marginRight: 8 }} />}
                    placeholder="Password"
                    style={{ borderRadius: 8, padding: '12px 16px' }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 24 }}>
                  <Button type="primary" htmlType="submit" loading={loading} block style={{ height: 48, borderRadius: 8, backgroundColor: '#5c3cff', fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    Log in <ArrowRightOutlined />
                  </Button>
                </Form.Item>

                <Divider plain style={{ color: '#999', margin: '0 0 24px 0', fontSize: 13 }}>Don't have an account?</Divider>

                <Link to="/signup" style={{ display: 'block' }}>
                  <Button block style={{ height: 48, borderRadius: 8, color: '#5c3cff', borderColor: '#d9d9d9', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    Sign up for an Account <UserOutlined />
                  </Button>
                </Link>
              </Form>
            ) : (
              // OTP STEP (Matches the card styling)
              <Form layout="vertical" onFinish={handleVerify} size="large">
                <Alert
                  type="info"
                  message="Two-Factor Authentication"
                  description={`We sent a 6-digit code to ${email}.`}
                  style={{ marginBottom: 24, borderRadius: 8 }}
                />
                <Form.Item name="otp" rules={[{ required: true, len: 6, message: 'Enter the 6-digit code' }]}>
                  <Input placeholder="Enter 6-digit OTP" maxLength={6} style={{ textAlign: 'center', letterSpacing: 8, fontSize: 18, borderRadius: 8, padding: '12px 16px' }} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 16 }}>
                  <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 48, borderRadius: 8, backgroundColor: '#5c3cff', fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    Verify & Continue <ArrowRightOutlined />
                  </Button>
                </Form.Item>
                <Button type="link" block onClick={() => setStep(0)} disabled={loading} style={{ color: '#888' }}>
                  Back to Login
                </Button>
              </Form>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
