import React, { useState } from 'react';
import { Dropdown, Badge, Button, List, Typography, Empty, Spin, Pagination, notification } from 'antd';
import { BellOutlined, DeleteOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const { Text } = Typography;

const NotificationDropdown = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    total,
    hasMore,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    loadNotifications
  } = useNotifications();
  
  const showToast = (type, message) => {
    api[type]({
      message,
      placement: 'topRight',
      duration: 3
    });
  };
  
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    showToast('success', 'Đã đánh dấu đã đọc');
  };
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    showToast('success', 'Đã đánh dấu tất cả đã đọc');
  };
  
  const handleDelete = async (id) => {
    await deleteNotification(id);
    showToast('success', 'Đã xóa thông báo');
  };
  
  const handleRefresh = () => {
    loadNotifications({ page: currentPage });
    showToast('info', 'Đã làm mới thông báo');
  };
  
  const handleNotificationClick = (item) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!item.isRead) {
      handleMarkAsRead(item._id);
    }
    
    // Điều hướng dựa trên loại thông báo
    switch (item.category) {
      case 'expiry':
        navigate('/reports?type=expiring');
        break;
      case 'stock':
        navigate('/inventory/balance');
        break;
      case 'stockcheck':
        if (item.data?.stockCheckId) {
          navigate(`/inventory/check?id=${item.data.stockCheckId}`);
        } else {
          navigate('/inventory/check');
        }
        break;
      case 'transaction':
        navigate('/reports?type=transactions');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      warning: '⚠️',
      error: '❌',
      success: '✅',
      info: 'ℹ️'
    };
    return iconMap[type] || 'ℹ️';
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const notificationContent = (
    <div style={{ 
      width: 350, 
      maxHeight: 400, 
      overflow: 'auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #d9d9d9'
    }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong>Thông báo ({unreadCount})</Text>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="text" 
            size="small" 
            onClick={handleRefresh}
            icon={<ReloadOutlined />}
            loading={loading}
          />
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={handleMarkAllAsRead}
              icon={<CheckOutlined />}
            >
              Đánh dấu tất cả
            </Button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty 
          description="Không có thông báo" 
          style={{ padding: '20px' }}
        />
      ) : (
        <List
          dataSource={notifications.slice(0, 10)}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                backgroundColor: item.isRead ? 'transparent' : '#f6ffed',
                cursor: 'pointer'
              }}
              onClick={() => handleNotificationClick(item)}
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: '16px' }}>{getNotificationIcon(item.type)}</span>}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong={!item.isRead}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </div>
                }
                description={
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {item.message}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <>
      {contextHolder}
      <Dropdown
        overlay={notificationContent}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{
          zIndex: 1050
        }}
      >
        <Badge count={unreadCount} size="small" overflowCount={99}>
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            style={{ border: 'none' }}
          />
        </Badge>
      </Dropdown>
    </>
  );
};

export default NotificationDropdown;