import React from 'react';
import { Layout, Button, Dropdown, Avatar, Menu } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import NotificationDropdown from '../../components/NotificationDropdown';

const { Header } = Layout;

const AppHeader = ({ collapsed, onToggle, currentUser, userRole, onLogout, onProfile }) => {
  const userMenu = (
    <Menu items={[
      { key: 'profile', label: 'Thông tin cá nhân', onClick: onProfile },
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: onLogout }
    ]} />
  );

  const getRoleLabel = (role) => {
    switch (role) {
      case 'Admin': return 'Quản trị viên';
      case 'Staff': return 'Nhân viên';
      case 'Accountant': return 'Kế toán';
      default: return role;
    }
  };

  return (
    <Header style={{ 
      padding: '0 16px', 
      background: '#fff', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'fixed',
      zIndex: 999,
      width: `calc(100% - ${collapsed ? '80px' : '250px'})`,
      left: collapsed ? '80px' : '250px',
      right: 0,
      top: 0
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ marginLeft: -16 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <NotificationDropdown />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}>
            {currentUser?.fullName || currentUser?.FullName || 'Người dùng'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', lineHeight: '16px' }}>
            {getRoleLabel(userRole)}
          </div>
        </div>
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar 
            src={currentUser?.avatar ? `http://localhost:5000${currentUser.avatar}` : null}
            icon={<UserOutlined />} 
            style={{ cursor: 'pointer' }} 
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;