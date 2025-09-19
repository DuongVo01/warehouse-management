import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { USER_ROLES, FORM_RULES } from '../utils/constants';
import { userAPI } from '../../../services/api/userAPI';

const UserForm = ({ form, editingUser, onSubmit, onCancel }) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Cập nhật avatarUrl khi editingUser thay đổi
  useEffect(() => {
    if (editingUser?.avatar) {
      setAvatarUrl(`http://localhost:3000${editingUser.avatar}`);
    } else {
      setAvatarUrl('');
    }
  }, [editingUser]);

  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await userAPI.uploadAvatar(formData);
      if (response.data.success) {
        const avatarPath = response.data.data.avatar;
        const fullAvatarUrl = `http://localhost:3000${avatarPath}`;
        setAvatarUrl(fullAvatarUrl);
        form.setFieldsValue({ avatar: avatarPath });
        
        // Chỉ cập nhật localStorage nếu đang edit chính user hiện tại
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (editingUser && editingUser._id === currentUser.id) {
          const updatedUser = { ...currentUser, avatar: avatarPath };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Trigger event để cập nhật header
          window.dispatchEvent(new Event('userUpdated'));
        }
        
        message.success('Tải ảnh thành công');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Tải ảnh thất bại');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && beforeUpload(file)) {
      handleAvatarUpload(file);
    }
  };

  // Kiểm tra xem có phải đang edit chính mình không
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isEditingSelf = editingUser && editingUser._id === currentUser.id;
  const canUploadAvatar = !editingUser || isEditingSelf;

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={FORM_RULES.username}
        >
          <Input placeholder="Nhập tên đăng nhập" disabled={!!editingUser} />
        </Form.Item>

        <Form.Item
          name="employeeCode"
          label="Mã nhân viên"
        >
          <Input placeholder="Tự động tạo" disabled />
        </Form.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={FORM_RULES.fullName}
        >
          <Input placeholder="Nhập họ tên đầy đủ" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={FORM_RULES.role}
        >
          <Select placeholder="Chọn vai trò">
            {USER_ROLES.map(role => (
              <Select.Option key={role.value} value={role.value}>
                {role.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="email"
          label="Email"
          rules={FORM_RULES.email}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={FORM_RULES.phone}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="avatar"
          label="Avatar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar 
              src={avatarUrl} 
              icon={<UserOutlined />} 
              size={64}
            />
            <div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                onChange={handleFileSelect}
              />
              <Button 
                icon={<UploadOutlined />}
                onClick={() => document.getElementById('avatar-upload').click()}
                disabled={!canUploadAvatar}
              >
                {canUploadAvatar ? 'Chọn ảnh' : 'Không thể sửa avatar'}
              </Button>
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Trạng thái"
          initialValue={true}
        >
          <Select>
            <Select.Option value={true}>Hoạt động</Select.Option>
            <Select.Option value={false}>Tạm khóa</Select.Option>
          </Select>
        </Form.Item>
      </div>



      <Form.Item
        name="password"
        label={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
        rules={editingUser ? [] : FORM_RULES.password}
      >
        <Input.Password placeholder={editingUser ? "Nhập mật khẩu mới" : "Nhập mật khẩu"} />
      </Form.Item>

      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <Space>
          <Button onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {editingUser ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default UserForm;