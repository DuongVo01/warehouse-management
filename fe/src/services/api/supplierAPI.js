import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const supplierAPI = {
  // Lấy danh sách nhà cung cấp
  getSuppliers: (params = {}) => {
    return axios.get(`${API_URL}/suppliers`, { 
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Lấy danh sách nhà cung cấp đang hoạt động
  getActiveSuppliers: () => {
    return axios.get(`${API_URL}/suppliers/active`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Tạo nhà cung cấp mới
  createSupplier: (data) => {
    return axios.post(`${API_URL}/suppliers`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Cập nhật nhà cung cấp
  updateSupplier: (id, data) => {
    return axios.put(`${API_URL}/suppliers/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Xóa nhà cung cấp
  deleteSupplier: (id) => {
    return axios.delete(`${API_URL}/suppliers/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export { supplierAPI };