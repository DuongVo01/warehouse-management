const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validator');

// Schema validation cho user
const userSchema = {
  Username: {
    isString: { errorMessage: 'Username phải là chuỗi' },
    notEmpty: { errorMessage: 'Username là bắt buộc' }
  },
  FullName: {
    isString: { errorMessage: 'Họ tên phải là chuỗi' },
    notEmpty: { errorMessage: 'Họ tên là bắt buộc' }
  },
  Email: {
    isEmail: { errorMessage: 'Email không hợp lệ' },
    notEmpty: { errorMessage: 'Email là bắt buộc' }
  },
  Role: {
    isIn: { 
      options: [['Admin', 'Staff', 'Accountant']], 
      errorMessage: 'Role phải là Admin, Staff hoặc Accountant' 
    }
  }
};

// API tạo người dùng
router.post(
  '/',
  auth,
  role(['Admin']),
  validate(userSchema),
  userController.createUser
);

// API cập nhật người dùng
router.put(
  '/:id',
  auth,
  role(['Admin']),
  validate(userSchema),
  userController.updateUser
);

// API xóa người dùng
router.delete(
  '/:id',
  auth,
  role(['Admin']),
  userController.deleteUser
);

// API chi tiết người dùng
router.get(
  '/:id',
  auth,
  role(['Admin']),
  userController.getUserById
);

// API danh sách người dùng
router.get(
  '/',
  auth,
  role(['Admin']),
  userController.getAllUsers
);

// API cập nhật trạng thái
router.patch(
  '/:id/status',
  auth,
  role(['Admin']),
  userController.updateUserStatus
);

module.exports = router;