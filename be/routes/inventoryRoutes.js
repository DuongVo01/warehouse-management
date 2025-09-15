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
    isNumeric: { errorMessage: 'Đơn giá phải là số' },
    optional: true
  },
  supplierID: {
    isInt: { errorMessage: 'SupplierID phải là số nguyên' },
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
  },
  customerInfo: {
    notEmpty: { errorMessage: 'Thông tin khách hàng là bắt buộc' }
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

// API sản phẩm sắp hết hạn
router.get(
  '/expiring',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getExpiringProducts
);

// API sản phẩm sắp hết hàng
router.get(
  '/low-stock',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getLowStockProducts
);

// API thống kê kho
router.get(
  '/stats',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getInventoryStats
);

// API kiểm kê kho
router.get(
  '/stock-checks',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  inventoryController.getStockChecks
);

router.post(
  '/stock-checks',
  auth,
  role(['Admin', 'Staff']),
  inventoryController.createStockCheck
);

router.put(
  '/stock-checks/:id/approve',
  auth,
  role(['Admin']),
  inventoryController.approveStockCheck
);

module.exports = router;