import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../../services/api/inventoryAPI';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0,
    expiredCount: 0
  });
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [inventoryTrend, setInventoryTrend] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
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
      const [transactionsRes, trendRes, recentRes, balanceRes] = await Promise.all([
        inventoryAPI.getDailyTransactions({ days: 30 }),
        inventoryAPI.getInventoryTrend({ days: 30 }),
        inventoryAPI.getTransactions({ limit: 10 }),
        inventoryAPI.getBalance()
      ]);
      
      if (transactionsRes.data.success) {
        setDailyTransactions(transactionsRes.data.data);
      }
      
      if (trendRes.data.success) {
        setInventoryTrend(trendRes.data.data);
      }
      
      if (recentRes.data.success) {
        setRecentTransactions(recentRes.data.data);
      }
      
      if (balanceRes.data.success) {
        const balances = balanceRes.data.data;
        
        // Lọc sản phẩm sắp hết hàng
        const lowStock = balances.filter(item => item.quantity <= 10);
        setLowStockItems(lowStock);
        
        const now = new Date();
        const thirtyDaysFromNow = new Date(Date.now() + 30*24*60*60*1000);
        
        // Lọc sản phẩm đã hết hạn
        const expired = balances.filter(item => {
          const expiryDate = item.productId?.expiryDate;
          return expiryDate && new Date(expiryDate) < now;
        });
        setExpiredItems(expired);
        
        // Lọc sản phẩm sắp hết hạn (chưa hết hạn nhưng sắp hết trong 30 ngày)
        const expiring = balances.filter(item => {
          const expiryDate = item.productId?.expiryDate;
          return expiryDate && new Date(expiryDate) >= now && new Date(expiryDate) <= thirtyDaysFromNow;
        });
        setExpiringItems(expiring);
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
    recentTransactions,
    lowStockItems,
    expiringItems,
    expiredItems,
    loading
  };
};