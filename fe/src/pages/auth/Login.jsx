import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api/authAPI';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await authAPI.login(values);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.success('Đăng nhập thành công');
      onLoginSuccess?.();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card title="Đăng nhập hệ thống" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;