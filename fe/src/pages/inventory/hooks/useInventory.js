import { useState, useEffect } from 'react';
import { message } from 'antd';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await inventoryAPI.getBalance({ limit: 100 });
      if (response.data.success) {
        const productsWithStock = response.data.data.filter(item => item.quantity > 0);
        setProducts(productsWithStock);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const exportInventory = async (exportData) => {
    try {
      await inventoryAPI.exportInventory(exportData);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi xuất kho: ${error.response?.data?.message || error.message}`);
      }
      return false;
    }
  };

  const importInventory = async (importData) => {
    try {
      await inventoryAPI.importInventory(importData);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi nhập kho: ${error.response?.data?.message || error.message}`);
      }
      return false;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    setLoading,
    loadProducts,
    exportInventory,
    importInventory
  };
};