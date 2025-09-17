import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const StockCheckSearch = ({ 
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
          placeholder="Tìm kiếm theo mã kiểm kê, sản phẩm, người tạo..."
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
          <Select.Option value="Pending">Chờ duyệt</Select.Option>
          <Select.Option value="Approved">Đã duyệt</Select.Option>
          <Select.Option value="Rejected">Từ chối</Select.Option>
        </Select>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
      </Space>
    </div>
  );
};

export default StockCheckSearch;