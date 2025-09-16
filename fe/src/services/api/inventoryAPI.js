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
  // Inventory operations
  importInventory: (data) => api.post('/inventory/import', data),
  exportInventory: (data) => api.post('/inventory/export', data),
  
  // Stock balance
  getBalance: (params) => api.get('/inventory/balance', { params }),
  
  // Stats
  getStats: () => api.get('/inventory/stats'),
  
  // Transactions (if needed)
  getTransactions: (params) => api.get('/inventory/transactions', { params })
};