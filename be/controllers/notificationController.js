const Notification = require('../models/Notification');

// Lấy danh sách thông báo
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead, category } = req.query;
    const userRole = req.user.role;
    
    const filter = { userId: req.user._id };
    
    // Role-based filtering
    if (userRole === 'Staff') {
      filter.category = { $in: ['stock', 'expiry', 'transaction', 'stockcheck'] };
    } else if (userRole === 'Accountant') {
      filter.category = { $in: ['report', 'transaction', 'system'] };
    }
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (category) {
      filter.category = category;
    }
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ 
        userId: req.user._id, 
        isRead: false,
        ...(userRole === 'Staff' && { category: { $in: ['stock', 'expiry', 'transaction', 'stockcheck'] } }),
        ...(userRole === 'Accountant' && { category: { $in: ['report', 'transaction', 'system'] } })
      })
    ]);
    
    res.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: (parseInt(page) * parseInt(limit)) < total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    
    res.json({ success: true, message: 'Đã đánh dấu tất cả đã đọc' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Notification.findOneAndDelete({ _id: id, userId: req.user._id });
    
    res.json({ success: true, message: 'Đã xóa thông báo' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};