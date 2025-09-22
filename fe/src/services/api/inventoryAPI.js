import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const inventoryAPI = {
  // Inventory operations
  importInventory: (data) => api.post('/inventory/import', data),
  exportInventory: (data) => api.post('/inventory/export', data),
  
  // Stock balance
  getBalance: (params) => api.get('/inventory/balance', { params }),
  getInventoryTrend: (params) => api.get('/inventory/trend', { params }),
  
  // Stock check
  getStockChecks: (params) => api.get('/inventory/stock-checks', { params }),
  createStockCheck: (data) => api.post('/inventory/stock-checks', data),
  approveStockCheck: (id) => api.put(`/inventory/stock-checks/${id}/approve`),
  rejectStockCheck: (id) => api.put(`/inventory/stock-checks/${id}/reject`),
  
  // Stats
  getStats: () => api.get('/inventory/stats'),
  getChartData: (params) => api.get('/inventory/chart-data', { params }),
  
  // Transactions (if needed)
  getTransactions: (params) => api.get('/inventory/transactions', { params }),
  getDailyTransactions: (params) => api.get('/inventory/daily-transactions', { params })
};