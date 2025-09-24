import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { categoryAPI } from '../../../services/api/categoryAPI';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryAPI.getCategories();
      if (response.data.success) {
        setAllCategories(response.data.data);
        setCategories(response.data.data);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (values) => {
    try {
      await categoryAPI.createCategory(values);
      message.success('Tạo danh mục thành công');
      loadCategories();
      return true;
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const updateCategory = async (id, values) => {
    try {
      await categoryAPI.updateCategory(id, values);
      message.success('Cập nhật danh mục thành công');
      loadCategories();
      return true;
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      message.success('Xóa danh mục thành công');
      loadCategories();
    } catch (error) {
      message.error('Lỗi xóa danh mục');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchCategories = useCallback((searchText, statusFilter) => {
    let filtered = [...allCategories];
    
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.code?.toLowerCase().includes(search) ||
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }
    
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setCategories(filtered);
  }, [allCategories]);

  return {
    categories,
    loading,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
  };
};