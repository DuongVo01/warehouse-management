import { useState, useEffect } from 'react';
import { message } from 'antd';
import { userAPI } from '../../../services/api/userAPI';
import { authAPI } from '../../../services/api/authAPI';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await userAPI.uploadAvatar(formData);
      if (response.data.success) {
        const avatarPath = response.data.data.avatar;
        
        // Cập nhật localStorage
        const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUserData, avatar: avatarPath };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger event để cập nhật header
        window.dispatchEvent(new Event('userUpdated'));
        
        return avatarPath;
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  };

  const loadUserProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const userData = response.data.data;
        setCurrentUser(userData);
        
        // Cập nhật avatar URL
        if (userData.avatar) {
          setAvatarUrl(`http://localhost:5000${userData.avatar}`);
        } else {
          setAvatarUrl('');
        }
        setAvatarFile(null);
        
        return userData;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      message.error('Lỗi tải thông tin cá nhân');
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (values) => {
    setLoading(true);
    try {
      // Upload avatar trước nếu có
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      
      const updateData = {
        fullName: values.FullName?.trim(),
        email: values.Email?.trim(),
        phone: values.Phone?.trim() || null
      };

      if (values.Password && values.Password.trim()) {
        updateData.password = values.Password.trim();
      }

      const userId = currentUser?.id;
      
      const response = await userAPI.updateProfile(userId, updateData);
      
      if (response.data.success) {
        // Reset avatar file sau khi thành công
        setAvatarFile(null);
        await loadUserProfile();
        message.success('Cập nhật thông tin thành công');
        return true;
      } else {
        message.error(response.data.message || 'Lỗi cập nhật thông tin');
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = ({ file }) => {
    // Lưu file tạm thời và hiển thị preview
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    return false; // Ngăn upload tự động
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return {
    loading,
    profileLoading,
    currentUser,
    avatarFile,
    avatarUrl,
    updateProfile,
    handleAvatarSelect,
    loadUserProfile
  };
};