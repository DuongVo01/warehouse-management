import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tag, Spin, Upload, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api/userAPI';
import { authAPI } from '../../services/api/authAPI';
import { getRoleLabel } from '../../utils/roleUtils';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  const handleAvatarUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await userAPI.uploadAvatar(formData);
      if (response.data.success) {
        message.success('Cập nhật avatar thành công');
        await loadUserProfile(); // Reload to get new avatar
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      message.error(error.response?.data?.message || 'Lỗi upload avatar');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        fullName: values.FullName?.trim(),
        email: values.Email?.trim(),
        phone: values.Phone?.trim() || null
      };

      if (values.Password && values.Password.trim()) {
        updateData.password = values.Password.trim();
      }

      const userId = currentUser?.id;
      console.log('Updating user:', userId, updateData);
      
      const response = await userAPI.updateProfile(userId, updateData);
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Cập nhật state và reload profile
        await loadUserProfile();
        message.success('Cập nhật thông tin thành công');
      } else {
        message.error(response.data.message || 'Lỗi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const userData = response.data.data;
        console.log('User data from API:', userData);
        console.log('Phone field specifically:', userData.phone, typeof userData.phone);
        setCurrentUser(userData);
        form.setFieldsValue({
          Username: userData.username,
          FullName: userData.fullName,
          Email: userData.email,
          Phone: userData.phone
        });
        console.log('Form values set:', {
          Username: userData.username,
          FullName: userData.fullName,
          Email: userData.email,
          Phone: userData.phone
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      message.error('Lỗi tải thông tin cá nhân');
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (profileLoading) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Thông tin cá nhân">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar 
            size={100} 
            src={currentUser?.avatar ? `http://localhost:3000${currentUser.avatar}` : null}
            icon={<UserOutlined />} 
          />
          <div style={{ marginTop: 16 }}>
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleAvatarUpload}
            >
              <Button icon={<UploadOutlined />}>Thay đổi avatar</Button>
            </Upload>
          </div>
        </div>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="Username" label="Tên đăng nhập">
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>
          <Form.Item name="FullName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input placeholder="Nhập họ tên đầy đủ" />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="Phone" label="Số điện thoại" rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Vai trò">
            <Tag color="blue">{getRoleLabel(currentUser?.role || currentUser?.Role)}</Tag>
          </Form.Item>
          <Form.Item name="Password" label="Mật khẩu mới (để trống nếu không đổi)" rules={[{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}>
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;