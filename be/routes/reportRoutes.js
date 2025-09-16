const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API tạo báo cáo giao dịch
router.get('/transactions', auth, role(['Admin', 'Accountant']), reportController.generateTransactionReport);

// API tạo báo cáo tồn kho
router.get('/balance', auth, role(['Admin', 'Accountant']), reportController.generateBalanceReport);

module.exports = router;