import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api/authAPI';

export const useLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(['inventory']);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin user hiện tại
  const [currentUser, setCurrentUser] = useState({});
  const userRole = currentUser?.role;

  // Load user profile from API
  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setCurrentUser(response.data.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to localStorage if API fails
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(localUser);
    }
  };

  useEffect(() => {
    loadUserProfile();
    
    // Lắng nghe event cập nhật user
    const handleUserUpdated = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(updatedUser);
    };
    
    window.addEventListener('userUpdated', handleUserUpdated);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
  }, []);

  const handleToggle = () => setCollapsed(!collapsed);
  
  const handleMenuClick = ({ key }) => navigate(key);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const handleProfile = () => navigate('/profile');

  return {
    collapsed,
    openKeys,
    setOpenKeys,
    currentUser,
    userRole,
    selectedKey: location.pathname,
    handleToggle,
    handleMenuClick,
    handleLogout,
    handleProfile,
    loadUserProfile
  };
};