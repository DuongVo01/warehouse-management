import React from 'react';
import { Form, Input, Button, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { getRoleLabel } from '../../../utils/roleUtils';

const ProfileForm = ({ form, currentUser, loading, onSubmit }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
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
  );
};

export default ProfileForm;