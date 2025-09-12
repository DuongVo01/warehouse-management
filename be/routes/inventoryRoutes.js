const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate, schemas } = require('../middleware/validator');

// Schema validation cho nhập kho
const importSchema = {
  productID: {
    isInt: { errorMessage: 'ProductID phải là số nguyên' },
    notEmpty: { errorMessage: 'ProductID là bắt buộc' }
  },
  quantity: {
    isInt: { options: { min: 1 }, errorMessage: 'Số lượng phải là số nguyên dương' },
    notEmpty: { errorMessage: 'Số lượng là bắt buộc' }
  },
  unitPrice: {
    isDecimal: { errorMessage: 'Đơn giá phải là số thập phân' },
    optional: true
  }
};

// Schema validation cho xuất kho
const exportSchema = {
  productID: {
    isInt: { errorMessage: 'ProductID phải là số nguyên' },
    notEmpty: { errorMessage: 'ProductID là bắt buộc' }
  },
  quantity: {
    isInt: { options: { min: 1 }, errorMessage: 'Số lượng phải là số nguyên dương' },
    notEmpty: { errorMessage: 'Số lượng là bắt buộc' }
  }
};

// API nhập kho
router.post(
  '/import',
  auth,
  role(['Admin', 'Staff']),
  validate(importSchema),
  inventoryController.importInventory
);

// API xuất kho
router.post(
  '/export',
  auth,
  role(['Admin', 'Staff']),
  validate(exportSchema),
  inventoryController.exportInventory
);

// API xem tồn kho
router.get(
  '/balance',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getInventoryBalance
);

// API lịch sử giao dịch
router.get(
  '/transactions',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getTransactionHistory
);

module.exports = router;