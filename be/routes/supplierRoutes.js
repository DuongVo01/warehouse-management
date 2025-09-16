const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API danh sách nhà cung cấp
router.get('/', auth, supplierController.getAllSuppliers);

// API tạo nhà cung cấp
router.post('/', auth, role(['Admin']), supplierController.createSupplier);

// API cập nhật nhà cung cấp
router.put('/:id', auth, role(['Admin']), supplierController.updateSupplier);

// API xóa nhà cung cấp
router.delete('/:id', auth, role(['Admin']), supplierController.deleteSupplier);

module.exports = router;