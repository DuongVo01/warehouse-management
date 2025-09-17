import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';

export const getMenuByRole = (userRole) => {
  const baseItems = [{ key: '/', icon: <DashboardOutlined />, label: 'Tổng quan' }];
  
  if (userRole === 'Admin') {
    return [
      ...baseItems,
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
      { key: '/suppliers', icon: <TeamOutlined />, label: 'Nhà cung cấp' },
      { key: '/reports', icon: <FileTextOutlined />, label: 'Báo cáo' },
      { key: '/users', icon: <UserOutlined />, label: 'Người dùng' }
    ];
  }
  
  if (userRole === 'Accountant') {
    return [
      ...baseItems,
      { key: '/inventory/balance', icon: <InboxOutlined />, label: 'Tồn kho' },
      { key: '/reports', icon: <FileTextOutlined />, label: 'Báo cáo' }
    ];
  }
  
  // Staff - chỉ có các chức năng kho
  return [
    ...baseItems,
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
    }
  ];
};