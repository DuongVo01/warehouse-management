import { useState, useEffect } from 'react';
import { message } from 'antd';
import { supplierAPI } from '../../../services/api/supplierAPI';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  const loadSuppliers = async () => {
    try {
      const response = await supplierAPI.getActiveSuppliers();
      if (response.data.success) {
        setSuppliers(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách nhà cung cấp');
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return { suppliers };
};