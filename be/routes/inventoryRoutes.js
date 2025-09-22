const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API nhập kho
router.post('/import', auth, role(['Admin', 'Staff']), inventoryController.importInventory);

// API xuất kho
router.post('/export', auth, role(['Admin', 'Staff']), inventoryController.exportInventory);

// API tồn kho
router.get('/balance', auth, inventoryController.getInventoryBalance);

// API thống kê
router.get('/stats', auth, inventoryController.getStats);

// API giao dịch
router.get('/transactions', auth, inventoryController.getTransactions);

// API dữ liệu biểu đồ
router.get('/daily-transactions', auth, inventoryController.getDailyTransactions);
router.get('/trend', auth, inventoryController.getInventoryTrend);

// API kiểm kê kho
router.get('/stock-checks', auth, inventoryController.getStockChecks);
router.post('/stock-checks', auth, role(['Admin', 'Staff']), inventoryController.createStockCheck);
router.put('/stock-checks/:id/approve', auth, role(['Admin']), inventoryController.approveStockCheck);
router.put('/stock-checks/:id/reject', auth, role(['Admin']), inventoryController.rejectStockCheck);

module.exports = router;