import { useState, useEffect } from 'react';
import { message } from 'antd';
import { reportAPI } from '../../../services/api/reportAPI';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [allReportData, setAllReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

  const loadStats = async () => {
    try {
      const response = await inventoryAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback nếu lỗi API
      setStats({
        totalProducts: 0,
        totalValue: 0,
        lowStockCount: 0,
        expiringCount: 0
      });
    }
  };

  const generateReport = async (reportType, dateRange) => {
    setLoading(true);
    try {
      let response;
      switch (reportType) {
        case 'inventory':
          response = await inventoryAPI.getBalance({ limit: 100 });
          break;
        case 'transactions':
          const params = { limit: 100 };
          if (dateRange && dateRange[0] && dateRange[1]) {
            params.startDate = dateRange[0].format('YYYY-MM-DD');
            params.endDate = dateRange[1].format('YYYY-MM-DD');
          }
          response = await inventoryAPI.getTransactions(params);
          break;
        case 'lowstock':
          response = await inventoryAPI.getBalance({ limit: 100 });
          // Lọc chỉ lấy sản phẩm tồn thấp
          if (response.data.success) {
            const lowStockData = response.data.data.filter(item => item.quantity <= 10);
            response.data.data = lowStockData;
          }
          break;
        case 'expiring':
          response = await inventoryAPI.getBalance({ limit: 100 });
          // Lọc chỉ lấy sản phẩm sắp hết hạn
          if (response.data.success) {
            const now = new Date();
            const thirtyDaysFromNow = new Date(Date.now() + 30*24*60*60*1000);
            const expiringData = response.data.data.filter(item => {
              const expiryDate = item.productId?.expiryDate;
              return expiryDate && new Date(expiryDate) >= now && new Date(expiryDate) <= thirtyDaysFromNow;
            });
            response.data.data = expiringData;
          }
          break;
        case 'expired':
          response = await inventoryAPI.getBalance({ limit: 100 });
          // Lọc chỉ lấy sản phẩm đã hết hạn
          if (response.data.success) {
            const now = new Date();
            const expiredData = response.data.data.filter(item => {
              const expiryDate = item.productId?.expiryDate;
              return expiryDate && new Date(expiryDate) < now;
            });
            response.data.data = expiredData;
          }
          break;
        default:
          response = { data: { success: true, data: [] } };
      }
      
      if (response.data.success) {
        const data = response.data.data || [];
        const arrayData = Array.isArray(data) ? data : [];
        setAllReportData(arrayData);
        setReportData(arrayData);
      } else {
        setAllReportData([]);
        setReportData([]);
      }
    } catch (error) {
      console.error('Generate report error:', error);
      message.error('Lỗi tải báo cáo');
      setAllReportData([]);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reportData,
    searchText,
    setSearchText,
    stats,
    loadStats,
    generateReport,
    setReportData,
    filterReportData: (text) => {
      if (!text.trim()) {
        setReportData(allReportData);
        return;
      }
      
      const search = text.toLowerCase();
      const filtered = allReportData.filter(item => {
        return (
          item.productId?.sku?.toLowerCase().includes(search) ||
          item.productId?.name?.toLowerCase().includes(search) ||
          item.supplierId?.name?.toLowerCase().includes(search) ||
          item.createdBy?.fullName?.toLowerCase().includes(search) ||
          item.customerInfo?.toLowerCase().includes(search) ||
          item.transactionType?.toLowerCase().includes(search)
        );
      });
      setReportData(filtered);
    }
  };
};