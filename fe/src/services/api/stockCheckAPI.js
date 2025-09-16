import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const stockCheckAPI = {
  // Lấy danh sách kiểm kê
  getStockChecks: (params = {}) => {
    return axios.get(`${API_BASE_URL}/stock-checks`, { 
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Tạo kiểm kê mới
  createStockCheck: (data) => {
    return axios.post(`${API_BASE_URL}/stock-checks`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Phê duyệt kiểm kê
  approveStockCheck: (id) => {
    return axios.put(`${API_BASE_URL}/stock-checks/${id}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export { stockCheckAPI };