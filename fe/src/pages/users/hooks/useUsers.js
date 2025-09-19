import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { userAPI } from '../../../services/api/userAPI';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers(searchParams);
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

  const searchUsers = useCallback((searchParams) => {
    loadUsers(searchParams);
  }, []);

  const deleteUser = async (userId) => {
    try {
      const response = await userAPI.deleteUser(userId);
      if (response.data.success) {
        setUsers(users.filter(u => u._id !== userId));
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

  const saveUser = async (userData, editingUser, avatarFile = null) => {
    try {
      if (editingUser) {
        const response = await userAPI.updateUser(editingUser._id, userData);
        if (response.data.success) {
          await loadUsers();
          message.success('Cập nhật người dùng thành công');
          return true;
        } else {
          message.error(response.data.message || 'Lỗi cập nhật người dùng');
          return false;
        }
      } else {
        // Tạo user trước
        const response = await userAPI.createUser(userData);
        if (response.data.success) {
          const newUser = response.data.data;
          
          // Nếu có avatar, upload sau khi tạo user
          if (avatarFile) {
            try {
              const formData = new FormData();
              formData.append('avatar', avatarFile);
              await userAPI.uploadAvatarForUser(newUser._id, formData);
            } catch (avatarError) {
              console.error('Avatar upload error:', avatarError);
              message.warning('Tạo người dùng thành công nhưng upload avatar thất bại');
            }
          }
          
          await loadUsers();
          message.success('Thêm người dùng thành công');
          return true;
        } else {
          message.error(response.data.message || 'Lỗi thêm người dùng');
          return false;
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(error.response?.data?.message || 'Lỗi lưu thông tin người dùng');
      }
      return false;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
    searchUsers,
    deleteUser,
    saveUser
  };
};