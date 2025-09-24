import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { notificationAPI } from '../services/api/notificationAPI';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications(params);
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
        setTotal(response.data.data.total);
        setHasMore(response.data.data.hasMore);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      message.error('Lỗi đánh dấu đã đọc');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      message.success('Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      message.error('Lỗi đánh dấu tất cả đã đọc');
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      const deletedNotif = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      message.success('Đã xóa thông báo');
    } catch (error) {
      message.error('Lỗi xóa thông báo');
    }
  }, [notifications]);

  useEffect(() => {
    loadNotifications();
    
    // Polling để cập nhật thông báo mới
    const interval = setInterval(() => {
      loadNotifications({ limit: 10 });
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    total,
    hasMore,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};