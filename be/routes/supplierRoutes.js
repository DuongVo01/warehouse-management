const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middleware/auth');

// Áp dụng middleware xác thực cho tất cả routes
router.use(authMiddleware);

// GET /api/suppliers - Lấy danh sách nhà cung cấp
router.get('/', supplierController.getSuppliers);

// POST /api/suppliers - Tạo nhà cung cấp mới
router.post('/', supplierController.createSupplier);

// PUT /api/suppliers/:id - Cập nhật nhà cung cấp
router.put('/:id', supplierController.updateSupplier);

// DELETE /api/suppliers/:id - Xóa nhà cung cấp
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;