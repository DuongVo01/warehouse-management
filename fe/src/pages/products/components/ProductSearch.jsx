import React, { useState, useEffect } from 'react';
import { Input, Button, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const ProductSearch = ({ onSearch, onAdd }) => {
  const [searchText, setSearchText] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  return (
    <div className="action-buttons">
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm sản phẩm
        </Button>
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </Space>
    </div>
  );
};

export default ProductSearch;