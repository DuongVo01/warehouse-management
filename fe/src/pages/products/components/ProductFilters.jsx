import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../../services/api/categoryAPI';

const ProductFilters = ({ onFilter, onRefresh, onAdd }) => {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  // Debounce function
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

  const debouncedSearchText = useDebounce(searchText, 300);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data.filter(cat => cat.status === 'active'));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Real-time filtering với debounce
  useEffect(() => {
    onFilter(debouncedSearchText, categoryFilter);
  }, [debouncedSearchText, categoryFilter, onFilter]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleReset = () => {
    setSearchText('');
    setCategoryFilter('all');
  };

  return (
    <div style={{ marginBottom: 16, padding: '16px', background: '#fafafaff', borderRadius: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 200 }}
            placeholder="Tìm kiếm danh mục..."
            showSearch
            filterOption={(input, option) => {
              if (option.value === 'all') return true;
              const searchText = input.toLowerCase();
              const categoryText = `${option.code} - ${option.name}`.toLowerCase();
              return categoryText.includes(searchText);
            }}
            options={[
              { value: 'all', label: 'Tất cả danh mục' },
              ...categories.map(cat => ({
                value: cat._id,
                label: `${cat.code} - ${cat.name}`,
                code: cat.code,
                name: cat.name
              }))
            ]}
          />
          
          <Button onClick={handleReset}>
            Đặt lại
          </Button>
          
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
        </Space>
        
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm sản phẩm
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;