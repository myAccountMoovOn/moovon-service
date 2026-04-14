import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider, Row, Col, Grid } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined, EnvironmentOutlined, BankOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/auth/me');
      if (data.customer) {
        form.setFieldsValue(data.customer);
      }
    } catch (err) {
      message.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const onUpdateProfile = async (values: any) => {
    setSaving(true);
    try {
      await axiosInstance.post('/auth/profile', values);
      message.success('Profile updated successfully');
    } catch (err) {
      message.error('Failed to update profile');
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
                  <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Company Name" name="companyName">
                <Input prefix={<BankOutlined />} />
              </Form.Item>

              <Form.Item label="Mailing Address" name="address">
                <Input.TextArea rows={3} placeholder="Full postal address" />
              </Form.Item>

              <Form.Item label="GST Number (Optional)" name="gstNumber">
                <Input prefix={<EnvironmentOutlined />} />
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
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item 
                label="Confirm Password" 
                name="confirm" 
                dependencies={['newPassword']}
                rules={[
                  { required: true },
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
                <Input.Password prefix={<LockOutlined />} />
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
