import { useState, useEffect } from 'react';
import { message } from 'antd';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
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
          response = await inventoryAPI.getTransactionHistory(params);
          break;
        case 'lowstock':
          response = await inventoryAPI.getLowStockProducts({ limit: 100 });
          break;
        case 'expiring':
          response = await inventoryAPI.getExpiringProducts({ limit: 100 });
          break;
        default:
          response = { data: { success: true, data: [] } };
      }
      
      if (response.data.success) {
        const data = response.data.data || [];
        setReportData(data);
      }
    } catch (error) {
      message.error('Lỗi tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reportData,
    stats,
    loadStats,
    generateReport,
    setReportData
  };
};