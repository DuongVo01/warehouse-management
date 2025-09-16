import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const userAPI = {
  // Lấy danh sách người dùng
  getUsers: (params = {}) => {
    return axios.get(`${API_BASE_URL}/users`, { 
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Tạo người dùng mới
  createUser: (data) => {
    return axios.post(`${API_BASE_URL}/users`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Cập nhật người dùng
  updateUser: (id, data) => {
    return axios.put(`${API_BASE_URL}/users/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Xóa người dùng
  deleteUser: (id) => {
    return axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  // Cập nhật profile cá nhân
  updateProfile: (id, data) => {
    return axios.put(`${API_BASE_URL}/users/${id}/profile`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};

export { userAPI };