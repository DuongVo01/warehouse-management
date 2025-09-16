const express = require('express');
const router = express.Router();
const stockCheckController = require('../controllers/stockCheckController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API danh sách kiểm kê
router.get('/', auth, stockCheckController.getAllStockChecks);

// API tạo kiểm kê
router.post('/', auth, role(['Admin', 'Staff']), stockCheckController.createStockCheck);

// API phê duyệt kiểm kê
router.put('/:id/approve', auth, role(['Admin']), stockCheckController.approveStockCheck);

module.exports = router;