import { useState, useEffect } from 'react';
import { message } from 'antd';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useStockBalance = () => {
  const [stockData, setStockData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

  const loadStockBalance = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getBalance({ limit: 100 });
      if (response.data.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setAllData(data);
      } else {
        message.error(response.data.message || 'Không thể tải dữ liệu tồn kho');
        setAllData([]);
      }
    } catch (error) {
      console.error('Error loading stock balance:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải dữ liệu tồn kho');
      }
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...allData];
    
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.productId?.name?.toLowerCase().includes(search) ||
        item.productId?.sku?.toLowerCase().includes(search) ||
        item.productId?.location?.toLowerCase().includes(search)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        const quantity = item.quantity;
        const expiryDate = item.productId?.expiryDate;
        
        switch (filterStatus) {
          case 'low-stock':
            return quantity <= 10;
          case 'medium-stock':
            return quantity > 10 && quantity <= 50;
          case 'expiring':
            return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
          case 'normal':
            return quantity > 50 && (!expiryDate || new Date(expiryDate) > new Date(Date.now() + 30*24*60*60*1000));
          default:
            return true;
        }
      });
    }
    
    setStockData(filtered);
    
    const totalProducts = filtered.length;
    const totalQuantity = filtered.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStockCount = filtered.filter(item => item.quantity <= 10).length;
    const expiringCount = filtered.filter(item => {
      const expiryDate = item.productId?.expiryDate;
      return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
    }).length;
    
    setStats({ totalProducts, totalQuantity, lowStockCount, expiringCount });
  };

  useEffect(() => {
    loadStockBalance();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchText, filterStatus, allData]);

  return {
    stockData,
    loading,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    stats,
    loadStockBalance
  };
};