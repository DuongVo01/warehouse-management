import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const reportAPI = {
  // Tạo báo cáo giao dịch
  generateTransactionReport: (params = {}) => {
    return axios.get(`${API_URL}/reports/transactions`, { 
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Tạo báo cáo tồn kho
  generateBalanceReport: (params = {}) => {
    return axios.get(`${API_URL}/reports/balance`, { 
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Download báo cáo
  downloadReport: (reportId) => {
    return axios.get(`${API_URL}/reports/download/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'blob'
    });
  }
};

export { reportAPI };