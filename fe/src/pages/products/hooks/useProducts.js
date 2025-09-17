import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { productAPI } from '../../../services/api/productAPI';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async (searchParams = {}) => {
    setLoading(true);
    try {
      const params = { limit: 100, ...searchParams };
      const response = await productAPI.getProducts(params);
      if (response.data.success) {
        const activeProducts = response.data.data.filter(product => product.isActive !== false);
        setProducts(Array.isArray(activeProducts) ? activeProducts : []);
      } else {
        setProducts([]);
        message.error(response.data.message || 'Không thể tải dữ liệu sản phẩm');
      }
    } catch (error) {
      setProducts([]);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi tải dữ liệu: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = useCallback((searchValue) => {
    const searchParams = {};
    if (searchValue) {
      searchParams.search = searchValue;
    }
    loadProducts(searchParams);
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const response = await productAPI.deleteProduct(productId);
      if (response.data.success) {
        message.success('Xóa sản phẩm thành công');
        loadProducts();
      } else {
        message.error(response.data.message || 'Lỗi xóa sản phẩm');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi xóa sản phẩm: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const saveProduct = async (productData, editingProduct) => {
    try {
      let response;
      if (editingProduct) {
        response = await productAPI.updateProduct(editingProduct._id, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        response = await productAPI.createProduct(productData);
        message.success('Thêm sản phẩm thành công');
      }
      
      if (response.data.success) {
        loadProducts();
        return true;
      } else {
        message.error(response.data.message || 'Lỗi xử lý sản phẩm');
        return false;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi xử lý sản phẩm: ${error.response?.data?.message || error.message}`);
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
    searchProducts,
    deleteProduct,
    saveProduct
  };
};