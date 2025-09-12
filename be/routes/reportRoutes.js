const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API tạo báo cáo nhập/xuất
router.get(
  '/import-export',
  auth,
  role(['Admin', 'Accountant']),
  reportController.generateImportExportReport
);

// API báo cáo tồn kho
router.get(
  '/inventory',
  auth,
  role(['Admin', 'Accountant']),
  reportController.generateInventoryReport
);

// API báo cáo hàng sắp hết hạn
router.get(
  '/expiry',
  auth,
  role(['Admin', 'Staff']),
  reportController.generateExpiryReport
);

// API báo cáo tồn thấp
router.get(
  '/low-stock',
  auth,
  role(['Admin', 'Staff']),
  reportController.generateLowStockReport
);

// API danh sách báo cáo
router.get(
  '/',
  auth,
  role(['Admin', 'Accountant']),
  reportController.getReports
);

module.exports = router;