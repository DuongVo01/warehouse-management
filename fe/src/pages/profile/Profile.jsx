import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api/userAPI';
import { getRoleLabel } from '../../utils/roleUtils';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        FullName: values.FullName?.trim(),
        Email: values.Email?.trim(),
        Phone: values.Phone?.trim() || null
      };

      if (values.Password && values.Password.trim()) {
        updateData.Password = values.Password.trim();
      }

      const userId = currentUser?.id || currentUser?.UserID;
      console.log('Updating user:', userId, updateData);
      
      const response = await userAPI.updateProfile(userId, updateData);
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Cập nhật localStorage với cấu trúc đúng
        const updatedUser = {
          ...currentUser,
          fullName: updateData.FullName,
          FullName: updateData.FullName,
          email: updateData.Email,
          Email: updateData.Email,
          phone: updateData.Phone,
          Phone: updateData.Phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
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

  React.useEffect(() => {
    form.setFieldsValue({
      Username: currentUser?.username || currentUser?.Username,
      FullName: currentUser?.fullName || currentUser?.FullName,
      Email: currentUser?.email || currentUser?.Email,
      Phone: currentUser?.phone || currentUser?.Phone
    });
  }, [form, currentUser]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Thông tin cá nhân">
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