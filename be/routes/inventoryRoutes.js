const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
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

module.exports = router;