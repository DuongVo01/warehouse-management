const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

// API danh sách người dùng
router.get('/', auth, role(['Admin']), userController.getAllUsers);

// API tạo người dùng
router.post('/', auth, role(['Admin']), userController.createUser);

// API chi tiết người dùng
router.get('/:id', auth, role(['Admin']), userController.getUserById);

// API cập nhật người dùng
router.put('/:id', auth, role(['Admin']), userController.updateUser);

// API cập nhật profile cá nhân
router.put('/:id/profile', auth, userController.updateProfile);

// API upload avatar
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// API xóa người dùng
router.delete('/:id', auth, role(['Admin']), userController.deleteUser);

module.exports = router;