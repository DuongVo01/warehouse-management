import { useState, useEffect } from 'react';
import { message } from 'antd';
import { inventoryAPI } from '../../../services/api/inventoryAPI';
import { productAPI } from '../../../services/api/productAPI';
import { authAPI } from '../../../services/api/authAPI';

export const useStockCheck = () => {
  const [stockChecks, setStockChecks] = useState([]);
  const [allStockChecks, setAllStockChecks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setUserRole(response.data.data.role);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadStockChecks = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getStockChecks();
      if (response.data.success) {
        const data = response.data.data || [];
        setAllStockChecks(data);
        setStockChecks(data);
      }
    } catch (error) {
      console.error('Stock check error:', error);
      message.error(`Lỗi tải danh sách kiểm kê: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterStockChecks = () => {
    let filtered = [...allStockChecks];
    
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.checkId?.toLowerCase().includes(search) ||
        item.productId?.sku?.toLowerCase().includes(search) ||
        item.productId?.name?.toLowerCase().includes(search) ||
        item.createdBy?.fullName?.toLowerCase().includes(search)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    setStockChecks(filtered);
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts({ limit: 100 });
      if (response.data.success) {
        setProducts(response.data.data.filter(p => p.isActive !== false));
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const handleProductChange = async (productId) => {
    try {
      const response = await inventoryAPI.getBalance({ productId });
      if (response.data.success) {
        const balance = response.data.data.find(b => b.productId._id === productId);
        setCurrentStock(balance ? balance.quantity : 0);
      }
    } catch (error) {
      console.error('Error loading stock:', error);
      setCurrentStock(0);
    }
  };

  const createStockCheck = async (checkData) => {
    try {
      const response = await inventoryAPI.createStockCheck(checkData);
      message.success('Tạo phiếu kiểm kê thành công');
      loadStockChecks();
      return { success: true };
    } catch (error) {
      console.error('Stock check creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi tạo phiếu kiểm kê';
      message.error(errorMessage);
      return { success: false };
    }
  };

  const approveStockCheck = async (checkId) => {
    try {
      const response = await inventoryAPI.approveStockCheck(checkId);
      if (response.data.success) {
        message.success('Duyệt phiếu kiểm kê thành công');
        loadStockChecks();
      } else {
        message.error(response.data.message || 'Lỗi duyệt phiếu kiểm kê');
      }
    } catch (error) {
      console.error('Approve error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi duyệt phiếu kiểm kê';
      message.error(errorMessage);
      loadStockChecks();
    }
  };

  const rejectStockCheck = async (checkId) => {
    try {
      await inventoryAPI.rejectStockCheck(checkId);
      message.success('Từ chối phiếu kiểm kê thành công');
      loadStockChecks();
    } catch (error) {
      message.error('Lỗi từ chối phiếu kiểm kê');
    }
  };

  useEffect(() => {
    loadStockChecks();
    loadProducts();
    loadUserProfile();
  }, []);

  useEffect(() => {
    filterStockChecks();
  }, [searchText, filterStatus, allStockChecks]);

  return {
    stockChecks,
    products,
    loading,
    userRole,
    currentStock,
    setCurrentStock,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    handleProductChange,
    createStockCheck,
    approveStockCheck,
    rejectStockCheck,
    loadStockChecks
  };
};