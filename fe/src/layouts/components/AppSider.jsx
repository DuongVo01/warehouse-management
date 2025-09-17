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
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
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