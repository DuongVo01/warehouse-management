import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
  // Dashboard stats
  getStats: () => api.get('/inventory/stats'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getExpiring: () => api.get('/inventory/expiring'),
  
  // Inventory transactions
  getTransactions: (params) => api.get('/inventory/transactions', { params }),
  getTransactionHistory: (params) => api.get('/inventory/transactions', { params }),
  createImport: (data) => api.post('/inventory/import', data),
  createExport: (data) => api.post('/inventory/export', data),
  
  // Stock balance
  getBalance: (params) => api.get('/inventory/balance', { params }),
  
  // Reports
  getLowStockProducts: (params) => api.get('/inventory/low-stock', { params }),
  getExpiringProducts: (params) => api.get('/inventory/expiring', { params }),
  
  // Stock check
  getStockChecks: (params) => api.get('/inventory/stock-checks', { params }),
  createStockCheck: (data) => api.post('/inventory/stock-checks', data),
  approveStockCheck: (id) => api.put(`/inventory/stock-checks/${id}/approve`)
};