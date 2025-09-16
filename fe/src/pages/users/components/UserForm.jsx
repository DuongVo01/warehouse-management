import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { USER_ROLES, FORM_RULES } from '../utils/constants';

const UserForm = ({ form, editingUser, onSubmit, onCancel }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="Username"
          label="Tên đăng nhập"
          rules={FORM_RULES.username}
        >
          <Input placeholder="Nhập tên đăng nhập" disabled={!!editingUser} />
        </Form.Item>

        <Form.Item
          name="FullName"
          label="Họ tên"
          rules={FORM_RULES.fullName}
        >
          <Input placeholder="Nhập họ tên đầy đủ" />
        </Form.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="Email"
          label="Email"
          rules={FORM_RULES.email}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="Phone"
          label="Số điện thoại"
          rules={FORM_RULES.phone}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Form.Item
          name="Role"
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

        <Form.Item
          name="IsActive"
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
        name="Password"
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