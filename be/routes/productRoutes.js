const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const productUpload = require('../middleware/productUpload');

// API danh sách sản phẩm
router.get('/', auth, productController.getAllProducts);

// API tạo sản phẩm
router.post('/', auth, role(['Admin']), productController.createProduct);

// API cập nhật sản phẩm
router.put('/:id', auth, role(['Admin']), productController.updateProduct);

// API upload hình ảnh sản phẩm
router.post('/:id/image', auth, role(['Admin']), productUpload.single('image'), productController.uploadProductImage);

// API xóa sản phẩm
router.delete('/:id', auth, role(['Admin']), productController.deleteProduct);

module.exports = router;