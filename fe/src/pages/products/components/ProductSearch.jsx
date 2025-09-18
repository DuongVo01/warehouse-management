import React, { useState, useCallback } from 'react';
import { Input, Button, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const ProductSearch = ({ onSearch, onAdd }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchValue);
  }, [onSearch, searchValue]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          style={{ width: 300 }}
          allowClear
          onClear={handleClear}
          enterButton={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm sản phẩm
        </Button>
      </Space>
    </div>
  );
};

export default ProductSearch;