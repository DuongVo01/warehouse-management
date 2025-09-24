const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Lấy danh sách thông báo
router.get('/', auth, notificationController.getNotifications);

// Đánh dấu đã đọc
router.put('/:id/read', auth, notificationController.markAsRead);

// Đánh dấu tất cả đã đọc
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Xóa thông báo
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;