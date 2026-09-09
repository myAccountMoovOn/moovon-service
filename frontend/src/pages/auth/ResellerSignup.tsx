import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Result } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BillJiNavbar from '../../components/layout/BillJiNavbar';
import BillJiFooter from '../../components/layout/BillJiFooter';

const { Title, Text } = Typography;

const ResellerSignup: React.FC = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [userEmail, setUserEmail] = useState('');

  const onFinishForm = (values: any) => {
    console.log('Received values of form: ', values);
    setUserEmail(values.email);
    message.success(`OTP sent to ${values.email}`);
    setStep('otp');
  };

  const onFinishOtp = (values: any) => {
    console.log('Received OTP: ', values);
    message.success('Email verified successfully!');
    setStep('success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F0FDF4' }}>
      <BillJiNavbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <Card style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.1)' }}>
          {step === 'form' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#064E3B', margin: 0 }}>Join as a Reseller</Title>
                <Text type="secondary">Partner with BillJi and grow your business.</Text>
              </div>

              <Form
                form={form}
                name="reseller_register"
                onFinish={onFinishForm}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="john@example.com" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    Create Reseller Account
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#16A34A', marginBottom: '16px' }} />
                <Title level={3} style={{ color: '#064E3B', margin: 0 }}>Verify Your Email</Title>
                <Text type="secondary">We've sent a 6-digit code to <br /><strong>{userEmail}</strong></Text>
              </div>

              <Form
                form={otpForm}
                name="reseller_otp"
                onFinish={onFinishOtp}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please input the OTP!' }, { len: 6, message: 'OTP must be 6 digits' }]}
                >
                  <Input.OTP length={6} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', height: '48px', fontSize: '16px' }}>
                    Verify & Continue
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Didn't receive the code? </Text>
                  <Button type="link" style={{ padding: 0, color: '#16A34A' }} onClick={() => message.success(`New OTP sent to ${userEmail}`)}>
                    Resend OTP
                  </Button>
                </div>
              </Form>
            </>
          )}

          {step === 'success' && (
            <Result
              status="success"
              title="Successfully Registered!"
              subTitle="Your reseller account has been verified and created."
              extra={[
                <Button type="primary" key="console" onClick={() => navigate('/login')} style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}>
                  Go to Login
                </Button>
              ]}
            />
          )}
        </Card>
      </div>
      <BillJiFooter />
    </div>
  );
};

export default ResellerSignup;
