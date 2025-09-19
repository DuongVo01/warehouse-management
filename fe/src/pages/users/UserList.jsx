import React, { useState, useEffect } from 'react';
import { Modal, Form, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUsers } from './hooks/useUsers';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import UserSearch from './components/UserSearch';

const UserList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [form] = Form.useForm();
  const { users, loading, deleteUser, saveUser, loadUsers, searchUsers } = useUsers();
  
  // Lấy thông tin user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Refresh danh sách users khi component focus lại
  useEffect(() => {
    const handleFocus = () => {
      loadUsers();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadUsers]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      avatar: user.avatar,
      password: ''
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const userData = {
      username: values.username?.trim(),
      fullName: values.fullName?.trim(),
      email: values.email?.trim(),
      phone: values.phone?.trim() || null,
      role: values.role,
      isActive: values.isActive !== undefined ? values.isActive : true,
      avatar: values.avatar
    };

    if (editingUser) {
      if (values.password && values.password.trim()) {
        userData.password = values.password.trim();
      }
    } else {
      if (!values.password || !values.password.trim()) {
        message.error('Vui lòng nhập mật khẩu');
        return;
      }
      userData.password = values.password.trim();
    }

    const success = await saveUser(userData, editingUser, values.avatarFile);
    if (success) {
      setModalVisible(false);
      form.resetFields();
    }
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
    const searchParams = {};
    if (value) searchParams.search = value;
    if (filterRole !== 'all') searchParams.role = filterRole;
    searchUsers(searchParams);
  };

  const handleFilterChange = (value) => {
    setFilterRole(value);
    const searchParams = {};
    if (searchText) searchParams.search = searchText;
    if (value !== 'all') searchParams.role = value;
    searchUsers(searchParams);
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilterRole('all');
    loadUsers();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý người dùng</h2>
      </div>
      
      <UserSearch 
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filterRole={filterRole}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
      />
      
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
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