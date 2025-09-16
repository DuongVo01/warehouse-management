import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(['inventory']);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser?.role || currentUser?.Role;

  // Menu cơ bản cho tất cả vai trò
  const baseMenuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/products', icon: <ShoppingOutlined />, label: 'Sản phẩm' },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: 'Kho hàng',
      children: [
        { key: '/inventory/import', label: 'Nhập kho' },
        { key: '/inventory/export', label: 'Xuất kho' },
        { key: '/inventory/balance', label: 'Tồn kho' },
        { key: '/inventory/check', label: 'Kiểm kê' }
      ]
    },
    { key: '/reports', icon: <FileTextOutlined />, label: 'Báo cáo' }
  ];

  // Menu chỉ dành cho Admin
  const adminOnlyItems = [
    { key: '/suppliers', icon: <TeamOutlined />, label: 'Nhà cung cấp' },
    { key: '/users', icon: <UserOutlined />, label: 'Người dùng' }
  ];

  // Tạo menu theo vai trò
  const menuItems = userRole === 'Admin' 
    ? [...baseMenuItems, ...adminOnlyItems]
    : baseMenuItems;

  const userMenu = (
    <Menu items={[
      { key: 'profile', label: 'Thông tin cá nhân' },
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }
    ]} />
  );

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div style={{ padding: '16px', color: 'white', textAlign: 'center' }}>
          <h3>{collapsed ? 'WMS' : 'Warehouse Management'}</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px', padding: '24px', background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;