import React from 'react';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const AppSider = ({ 
  collapsed, 
  openKeys, 
  setOpenKeys, 
  menuItems, 
  selectedKey, 
  onMenuClick 
}) => {
  const onBreakpoint = (broken) => {
    // Tự động collapse khi màn hình nhỏ
    if (broken !== collapsed) {
      // Có thể thêm logic nếu cần
    }
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed} 
      width={250}
      breakpoint="lg"  // Breakpoint tại large screen (992px)
      onBreakpoint={onBreakpoint}
      style={{
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        left: 0,
        top: 0
      }}
    >
      <div style={{ padding: '16px', color: 'white', textAlign: 'center' }}>
        <h3>{collapsed ? 'WMS' : 'Warehouse Management'}</h3>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default AppSider;