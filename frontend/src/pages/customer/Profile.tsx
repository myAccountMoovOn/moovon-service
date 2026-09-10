import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Grid } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined, EnvironmentOutlined, BankOutlined, MailOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import { useAuth, getStorageKey } from '../../context/AuthContext';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);

    // 1. Load initial fallback details from localStorage / session
    const storedUserStr = localStorage.getItem(getStorageKey('user'));
    let fallbackObj: any = user || {};
    if (storedUserStr) {
      try {
        fallbackObj = { ...fallbackObj, ...JSON.parse(storedUserStr) };
      } catch (e) {}
    }

    const currentValues = {
      name: fallbackObj.name || fallbackObj.fullName || fallbackObj.user_metadata?.name || fallbackObj.user_metadata?.full_name || '',
      phone: fallbackObj.phone || fallbackObj.user_metadata?.phone || '',
      email: fallbackObj.email || '',
      companyName: fallbackObj.companyName || fallbackObj.user_metadata?.companyName || '',
      address: fallbackObj.address || fallbackObj.user_metadata?.address || '',
      gstNumber: fallbackObj.gstNumber || fallbackObj.user_metadata?.gstNumber || '',
    };

    form.setFieldsValue(currentValues);

    // 2. Fetch fresh profile details from backend /auth/me
    try {
      const { data } = await axiosInstance.get('/auth/me');
      const c = data?.data?.customer || data?.customer || data?.data?.user || data?.data || {};
      
      const mergedValues = {
        name: c.name || c.fullName || currentValues.name || '',
        phone: c.phone || currentValues.phone || '',
        email: c.email || currentValues.email || '',
        companyName: c.companyName || currentValues.companyName || '',
        address: c.address || currentValues.address || '',
        gstNumber: c.gstNumber || currentValues.gstNumber || '',
      };

      form.setFieldsValue(mergedValues);

      // Cache merged details in localStorage so they persist across refreshes
      const updatedUser = { ...fallbackObj, ...mergedValues };
      localStorage.setItem(getStorageKey('user'), JSON.stringify(updatedUser));
    } catch (err) {
      // Keep pre-filled local values cleanly if offline or dev backend is disconnected
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (values: any) => {
    setSaving(true);
    try {
      const { data } = await axiosInstance.post('/auth/profile', values);
      message.success('Profile updated successfully');

      // Update form and localStorage with newly saved details
      const savedData = data?.data || values;
      const updatedFields = {
        name: savedData.name || values.name,
        phone: savedData.phone || values.phone,
        companyName: savedData.companyName || values.companyName,
        address: savedData.address || values.address,
        gstNumber: savedData.gstNumber || values.gstNumber,
      };

      form.setFieldsValue(updatedFields);

      const storedUserStr = localStorage.getItem(getStorageKey('user'));
        if (storedUserStr) {
          try {
            const parsed = JSON.parse(storedUserStr);
            localStorage.setItem(getStorageKey('user'), JSON.stringify({ ...parsed, ...updatedFields }));
        } catch (e) {}
      }
    } catch (err: any) {
      console.error('Failed to update profile:', err?.response?.data || err?.message);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update profile';
      message.error(typeof errMsg === 'string' ? errMsg : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (values: any) => {
    try {
      await axiosInstance.post('/auth/change-password', {
        newPassword: values.newPassword
      });
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err) {
      message.error('Failed to change password');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Account Settings</Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span><UserOutlined style={{ marginRight: 8 }} /> Personal Details</span>} 
            className="card-shadow" 
            loading={loading}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onUpdateProfile}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter your full name' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Full Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email Address" name="email">
                <Input prefix={<MailOutlined />} disabled placeholder="Email Address" />
              </Form.Item>

              <Form.Item label="Company Name" name="companyName">
                <Input prefix={<BankOutlined />} placeholder="Company Name" />
              </Form.Item>

              <Form.Item label="Mailing Address" name="address">
                <Input.TextArea rows={3} placeholder="Full postal address" />
              </Form.Item>

              <Form.Item label="GST Number (Optional)" name="gstNumber">
                <Input prefix={<EnvironmentOutlined />} placeholder="GST Number" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Save Profile Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<span><LockOutlined style={{ marginRight: 8 }} /> Security</span>} 
            className="card-shadow"
            style={{ marginTop: isMobile ? 24 : 0 }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Update your login password to keep your account secure.
            </Text>
            
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={onChangePassword}
            >
              <Form.Item 
                label="New Password" 
                name="newPassword" 
                rules={[{ required: true, min: 6, message: 'Password must be at least 6 chars' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
              </Form.Item>

              <Form.Item 
                label="Confirm Password" 
                name="confirm" 
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item>
                <Button block onClick={() => passwordForm.submit()}>
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
