import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const SupplierSearch = ({ 
  searchText, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  onRefresh 
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Space wrap>
        <Input
          placeholder="Tìm kiếm theo tên, người liên hệ, SĐT, email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 350 }}
        />
        <Select
          value={filterStatus}
          onChange={onFilterChange}
          style={{ width: 150 }}
          placeholder="Lọc trạng thái"
        >
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
        </Select>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
      </Space>
    </div>
  );
};

export default SupplierSearch;