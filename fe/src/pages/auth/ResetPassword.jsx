import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      message.error('Link không hợp lệ');
      navigate('/login');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    setVerifying(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/verify-reset-token?token=${token}`);
      
      if (response.data.success) {
        setTokenValid(true);
        setUserEmail(response.data.email);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Link không hợp lệ hoặc đã hết hạn');
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: values.newPassword
      });
      
      if (response.data.success) {
        message.success('Đặt lại mật khẩu thành công');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Đang xác thực link...</p>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }}>
            ✗
          </div>
          <h3>Link không hợp lệ</h3>
          <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn</p>
          <Link to="/login">
            <Button type="primary">Quay lại đăng nhập</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2>Đặt lại mật khẩu</h2>
          <p style={{ color: '#666' }}>
            Đặt mật khẩu mới cho tài khoản: <strong>{userEmail}</strong>
          </p>
        </div>

        <Form onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;