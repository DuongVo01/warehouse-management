const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// API danh sách sản phẩm
router.get('/', auth, productController.getAllProducts);

// API tạo sản phẩm
router.post('/', auth, role(['Admin']), productController.createProduct);

// API cập nhật sản phẩm
router.put('/:id', auth, role(['Admin']), productController.updateProduct);

// API xóa sản phẩm
router.delete('/:id', auth, role(['Admin']), productController.deleteProduct);

module.exports = router;