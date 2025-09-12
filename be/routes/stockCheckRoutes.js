const express = require('express');
const router = express.Router();
const stockCheckController = require('../controllers/stockCheckController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validator');

// Schema validation cho tạo kiểm kê
const stockCheckSchema = {
  productID: {
    isInt: { errorMessage: 'ProductID phải là số nguyên' },
    notEmpty: { errorMessage: 'ProductID là bắt buộc' }
  },
  actualQty: {
    isInt: { options: { min: 0 }, errorMessage: 'Số lượng thực tế phải là số nguyên không âm' },
    notEmpty: { errorMessage: 'Số lượng thực tế là bắt buộc' }
  }
};

// API tạo phiếu kiểm kê
router.post(
  '/',
  auth,
  role(['Admin', 'Staff']),
  validate(stockCheckSchema),
  stockCheckController.createStockCheck
);

// API duyệt phiếu kiểm kê
router.put(
  '/:id/approve',
  auth,
  role(['Admin']),
  stockCheckController.approveStockCheck
);

// API danh sách phiếu kiểm kê
router.get(
  '/',
  auth,
  role(['Admin', 'Staff']),
  stockCheckController.getStockChecks
);

// API chi tiết phiếu kiểm kê
router.get(
  '/:id',
  auth,
  role(['Admin', 'Staff']),
  stockCheckController.getStockCheckById
);

module.exports = router;