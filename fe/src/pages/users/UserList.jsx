import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api/userAPI';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const roles = [
    { value: 'Admin', label: 'Quản trị viên', color: 'red' },
    { value: 'Staff', label: 'Nhân viên', color: 'blue' },
    { value: 'Accountant', label: 'Kế toán', color: 'green' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        message.error(response.data.message || 'Lỗi tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải danh sách người dùng');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'Username',
      key: 'Username',
      render: (username) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {username}
        </span>
      )
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName'
    },
    {
      title: 'Vai trò',
      dataIndex: 'Role',
      key: 'Role',
      render: (role) => {
        const roleInfo = roles.find(r => r.value === role);
        return (
          <Tag color={roleInfo?.color}>
            {roleInfo?.label}
          </Tag>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      render: (email) => (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </span>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'Phone',
      key: 'Phone',
      render: (phone) => phone ? (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {phone}
        </span>
      ) : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm khóa'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.UserID)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              disabled={record.UserID === 1}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      Username: user.Username,
      FullName: user.FullName,
      Email: user.Email,
      Phone: user.Phone,
      Role: user.Role,
      IsActive: user.IsActive,
      Password: ''
    });
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await userAPI.deleteUser(userId);
      if (response.data.success) {
        setUsers(users.filter(u => u.UserID !== userId));
        message.success('Xóa người dùng thành công');
      } else {
        message.error(response.data.message || 'Lỗi xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(error.response?.data?.message || 'Lỗi xóa người dùng');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const userData = {
        Username: values.Username?.trim(),
        FullName: values.FullName?.trim(),
        Email: values.Email?.trim(),
        Phone: values.Phone?.trim() || null,
        Role: values.Role,
        IsActive: values.IsActive !== undefined ? values.IsActive : true
      };

      if (editingUser) {
        if (values.Password && values.Password.trim()) {
          userData.Password = values.Password.trim();
        }
        
        const response = await userAPI.updateUser(editingUser.UserID, userData);
        if (response.data.success) {
          await loadUsers();
          message.success('Cập nhật người dùng thành công');
        } else {
          message.error(response.data.message || 'Lỗi cập nhật người dùng');
          return;
        }
      } else {
        if (!values.Password || !values.Password.trim()) {
          message.error('Vui lòng nhập mật khẩu');
          return;
        }
        userData.Password = values.Password.trim();
        
        console.log('Final userData being sent:', userData);
        console.log('All form values:', values);
        const response = await userAPI.createUser(userData);
        if (response.data.success) {
          await loadUsers();
          message.success('Thêm người dùng thành công');
        } else {
          message.error(response.data.message || 'Lỗi thêm người dùng');
          return;
        }
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(error.response?.data?.message || 'Lỗi lưu thông tin người dùng');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý người dùng</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm người dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="UserID"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="Username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" disabled={!!editingUser} />
            </Form.Item>

            <Form.Item
              name="FullName"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nhập họ tên đầy đủ" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="Email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="Phone"
              label="Số điện thoại"
              rules={[
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="Role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select placeholder="Chọn vai trò">
                {roles.map(role => (
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
            rules={editingUser ? [] : [
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password placeholder={editingUser ? "Nhập mật khẩu mới" : "Nhập mật khẩu"} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;