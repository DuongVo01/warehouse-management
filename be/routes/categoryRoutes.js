const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Lấy danh sách categories
router.get('/', auth, categoryController.getCategories);

// Tạo category mới
router.post('/', auth, role(['Admin']), categoryController.createCategory);

// Cập nhật category
router.put('/:id', auth, role(['Admin']), categoryController.updateCategory);

// Xóa category
router.delete('/:id', auth, role(['Admin']), categoryController.deleteCategory);

module.exports = router;