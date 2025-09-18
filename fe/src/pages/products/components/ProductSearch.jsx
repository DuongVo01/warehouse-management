import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// Custom hook cho debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const ProductSearch = ({ onSearch, onAdd }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500); // Delay 500ms
  const timeoutRef = useRef(null);

  // Tự động tìm kiếm khi giá trị debounce thay đổi
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onSearch(debouncedSearchValue);
    }, 0);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedSearchValue, onSearch]);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleAddProduct = useCallback(() => {
    onAdd();
  }, [onAdd]);

  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
          value={searchValue}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          allowClear
          onClear={handleClear}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddProduct}
        >
          Thêm sản phẩm
        </Button>
      </Space>
    </div>
  );
};

export default ProductSearch;