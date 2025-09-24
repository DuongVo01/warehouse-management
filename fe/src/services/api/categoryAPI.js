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

export const categoryAPI = {
  // Lấy danh sách categories
  getCategories: () => api.get('/categories'),
  
  // Tạo category mới
  createCategory: (data) => api.post('/categories', data),
  
  // Cập nhật category
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  
  // Xóa category
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};