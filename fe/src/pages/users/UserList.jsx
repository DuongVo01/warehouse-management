import React, { useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';

const UserList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const { users, loading, deleteUser, saveUser } = useUsers();
  
  // Lấy thông tin user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user:', currentUser);
  console.log('Users list:', users);

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

  const handleSubmit = async (values) => {
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
    } else {
      if (!values.Password || !values.Password.trim()) {
        message.error('Vui lòng nhập mật khẩu');
        return;
      }
      userData.Password = values.Password.trim();
    }

    const success = await saveUser(userData, editingUser);
    if (success) {
      setModalVisible(false);
      form.resetFields();
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

      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteUser}
        currentUser={currentUser}
      />

      <Modal
        title={editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <UserForm
          form={form}
          editingUser={editingUser}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default UserList;