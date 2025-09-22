import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [inventoryTrend, setInventoryTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const [transactionsRes, trendRes] = await Promise.all([
        inventoryAPI.getDailyTransactions({ days: 30 }),
        inventoryAPI.getInventoryTrend({ days: 30 })
      ]);
      
      if (transactionsRes.data.success) {
        setDailyTransactions(transactionsRes.data.data);
      }
      
      if (trendRes.data.success) {
        setInventoryTrend(trendRes.data.data);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  useEffect(() => {
    loadStats();
    loadChartData();
  }, []);

  return {
    stats,
    dailyTransactions,
    inventoryTrend,
    loading
  };
};