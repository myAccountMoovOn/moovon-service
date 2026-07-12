import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Steps, Select, Row, Col } from 'antd';
import { ShopOutlined, MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [accountType, setAccountType] = useState('customer');
  const [companies, setCompanies] = useState<{ id: string; name: string; code: string }[]>([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (accountType === 'customer' || accountType === 'business') {
      const fetchCompanies = async () => {
        setFetchingCompanies(true);
        try {
          const type = accountType === 'customer' ? 'business' : 'reseller';
          const res = await axios.get(`${API_URL}/companies/public/list?type=${type}`);
          const raw = res.data;
          const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
          setCompanies(list);
        } catch (e) {
          console.error('Failed to fetch companies', e);
        } finally {
          setFetchingCompanies(false);
        }
      };
      fetchCompanies();
    } else {
      setCompanies([]);
    }
  }, [accountType]);

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      if (values.accountType === 'customer') {
        endpoint = '/auth/register-customer-step1';
      } else if (values.accountType === 'business') {
        endpoint = '/auth/register-provider-step1';
      } else {
        endpoint = '/auth/register-reseller-step1';
      }

      const res = await axios.post(`${API_URL}${endpoint}`, {
        companyName: values.companyName,
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
        companyCode: values.businessCode,
        resellerCode: values.resellerCode,
      });
      setEmail(values.email);
      if (values.accountType !== 'customer') {
        setCompanyCode(res.data?.data?.companyCode || '');
      }
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

  const onAccountTypeChange = (value: string) => {
    setAccountType(value);
    form.resetFields(['companyName', 'businessCode', 'resellerCode']);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg-sidebar)', padding: '40px 20px' }}>
      <Card style={{ width: 500, maxWidth: '100%', borderRadius: 16 }} className="card-shadow">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} className="text-primary" style={{ margin: 0 }}>Create an Account</Title>
          <Text type="secondary">Join Moovon today</Text>
        </div>

        <Steps current={step} style={{ marginBottom: 24 }} size="small" items={[
          { title: 'Details' },
          { title: 'Verify' },
        ]} />

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        {step === 0 ? (
          <Form form={form} layout="vertical" onFinish={handleRegister} initialValues={{ accountType: 'customer' }}>
            <Form.Item name="accountType" label="I am a..." rules={[{ required: true }]}>
              <Select size="large" onChange={onAccountTypeChange}>
                <Option value="customer">Customer (End User)</Option>
                <Option value="business">Business (Service Provider)</Option>
                <Option value="reseller">Reseller (Agency)</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Your full name" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Phone number" size="large" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} style={{ marginTop: -8 }}>
              <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Min. 6 characters" size="large" />
            </Form.Item>

            {accountType === 'customer' && (
              <Form.Item name="businessCode" label="Select a Business" rules={[{ required: true, message: 'Please select a business' }]} extra="The business you want to sign up under">
                <Select
                  showSearch
                  placeholder="Search and select a business"
                  optionFilterProp="children"
                  loading={fetchingCompanies}
                  size="large"
                >
                  {companies.map(c => (
                    <Option key={c.code} value={c.code}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {(accountType === 'business' || accountType === 'reseller') && (
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                <Input prefix={<ShopOutlined />} placeholder="Your company name" size="large" />
              </Form.Item>
            )}

            {accountType === 'business' && (
              <Form.Item name="resellerCode" label="Select a Reseller (Optional)" extra="If a Reseller invited you, select them here">
                <Select
                  showSearch
                  allowClear
                  placeholder="Select a reseller (optional)"
                  optionFilterProp="children"
                  loading={fetchingCompanies}
                  size="large"
                >
                  {companies.map(c => (
                    <Option key={c.code} value={c.code}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item>
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
            {accountType !== 'customer' && companyCode && (
              <Alert 
                type="info" 
                message={`Your unique Code is: ${companyCode}`} 
                style={{ marginBottom: 16 }} 
              />
            )}
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
  );
};

export default Signup;
