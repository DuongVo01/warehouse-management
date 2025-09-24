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

export const notificationAPI = {
  // Lấy danh sách thông báo
  getNotifications: (params) => api.get('/notifications', { params }),
  
  // Đánh dấu đã đọc
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Đánh dấu tất cả đã đọc
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  
  // Xóa thông báo
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};