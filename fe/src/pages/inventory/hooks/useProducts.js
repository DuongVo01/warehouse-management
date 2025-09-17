import { useState, useEffect } from 'react';
import { message } from 'antd';
import { productAPI } from '../../../services/api/productAPI';

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts({ limit: 100 });
      if (response.data.success) {
        const activeProducts = response.data.data.filter(p => p.isActive !== false);
        setProducts(activeProducts);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products };
};