import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useLayout } from './hooks/useLayout';
import { getMenuByRole } from './utils/menuConfig';
import AppSider from './components/AppSider';
import AppHeader from './components/AppHeader';

const { Content } = Layout;

const MainLayout = () => {
  const {
    collapsed,
    openKeys,
    setOpenKeys,
    currentUser,
    userRole,
    selectedKey,
    handleToggle,
    handleMenuClick,
    handleLogout,
    handleProfile
  } = useLayout();

  const menuItems = getMenuByRole(userRole);

  // Tính toán margin left cho content dựa trên trạng thái sidebar
  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSider
        collapsed={collapsed}
        openKeys={openKeys}
        setOpenKeys={setOpenKeys}
        menuItems={menuItems}
        selectedKey={selectedKey}
        onMenuClick={handleMenuClick}
      />
      <Layout style={{ marginLeft: sidebarWidth }}>
        <AppHeader
          collapsed={collapsed}
          onToggle={handleToggle}
          currentUser={currentUser}
          userRole={userRole}
          onLogout={handleLogout}
          onProfile={handleProfile}
        />
        <Content 
          style={{ 
            margin: '16px', 
            padding: '24px', 
            background: '#fff',
            marginTop: 64, // Chiều cao header
            marginLeft: 0, // Đã được xử lý ở Layout cha
            marginRight: 0
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;