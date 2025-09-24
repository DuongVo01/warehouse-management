import React, { useState, useEffect } from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const CategoryFilters = ({ onSearch, onRefresh }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleReset = () => {
    setSearchText('');
    setStatusFilter('all');
  };

  // Tự động tìm kiếm khi thay đổi
  useEffect(() => {
    onSearch(searchText, statusFilter);
  }, [searchText, statusFilter, onSearch]);

  return (
    <div style={{ marginBottom: 16, padding: '16px', background: '#fafafa', borderRadius: '6px' }}>
      <Space wrap>
        <Input
          placeholder="Tìm kiếm theo mã, tên, mô tả..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 150 }}
        >
          <Select.Option value="all">Tất cả trạng thái</Select.Option>
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

export default CategoryFilters;