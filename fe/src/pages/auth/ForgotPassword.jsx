import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Step } = Steps;

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [username, setUsername] = useState('');

  const handleForgotPassword = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        emailOrUsername: values.emailOrUsername
      });
      
      if (response.data.success) {
        setUsername(response.data.email);
        setCurrentStep(1);
        message.success(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token: resetToken,
        newPassword: values.newPassword
      });
      
      if (response.data.success) {
        setCurrentStep(2);
        message.success('Đặt lại mật khẩu thành công');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Quên mật khẩu</h2>
          <Steps current={currentStep} size="small">
            <Step title="Nhập tài khoản" />
            <Step title="Đặt lại mật khẩu" />
            <Step title="Hoàn thành" />
          </Steps>
        </div>

        {currentStep === 0 && (
          <Form onFinish={handleForgotPassword} layout="vertical">
            <Form.Item
              name="emailOrUsername"
              label="Email hoặc tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập email hoặc tên đăng nhập"
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
                Gửi link đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>
              ✉️
            </div>
            <h3>Email đã được gửi!</h3>
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Email đã gửi đến:</strong> {username}
              </p>
            </div>
            <p>Vui lòng kiểm tra hộp thư đến và click vào link để đặt lại mật khẩu.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Nếu không thấy email, hãy kiểm tra thư mục spam.
            </p>
            <Button 
              type="default" 
              onClick={() => setCurrentStep(0)}
              style={{ marginTop: '16px' }}
            >
              Gửi lại email
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>
              ✓
            </div>
            <h3>Đặt lại mật khẩu thành công!</h3>
            <p>Bạn có thể đăng nhập với mật khẩu mới</p>
            <Link to="/login">
              <Button type="primary" size="large">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;