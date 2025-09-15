const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validator');

// Định nghĩa schema validation cho tạo/cập nhật sản phẩm
const productValidationSchema = {
  sku: {
    isString: { errorMessage: 'SKU phải là chuỗi' },
    notEmpty: { errorMessage: 'SKU là bắt buộc' },
    isLength: { options: { max: 50 }, errorMessage: 'SKU không được vượt quá 50 ký tự' },
  },
  name: {
    isString: { errorMessage: 'Tên sản phẩm phải là chuỗi' },
    notEmpty: { errorMessage: 'Tên sản phẩm là bắt buộc' },
    isLength: { options: { max: 150 }, errorMessage: 'Tên sản phẩm không được vượt quá 150 ký tự' },
  },
  unit: {
    isString: { errorMessage: 'Đơn vị tính phải là chuỗi' },
    notEmpty: { errorMessage: 'Đơn vị tính là bắt buộc' },
    isLength: { options: { max: 20 }, errorMessage: 'Đơn vị tính không được vượt quá 20 ký tự' },
  },
  costPrice: {
    isDecimal: { errorMessage: 'Giá nhập phải là số thập phân' },
    notEmpty: { errorMessage: 'Giá nhập là bắt buộc' },
  },
  salePrice: {
    isDecimal: { errorMessage: 'Giá bán phải là số thập phân' },
    notEmpty: { errorMessage: 'Giá bán là bắt buộc' },
  },
  expiryDate: {
    isDate: { errorMessage: 'Hạn sử dụng phải là định dạng ngày hợp lệ' },
    optional: true,
  },
  location: {
    isString: { errorMessage: 'Vị trí kệ phải là chuỗi' },
    isLength: { options: { max: 50 }, errorMessage: 'Vị trí kệ không được vượt quá 50 ký tự' },
    optional: true,
  },
  isActive: {
    isBoolean: { errorMessage: 'Trạng thái phải là boolean' },
    optional: true,
  },
};

// Định nghĩa schema validation cho tra cứu sản phẩm
const searchValidationSchema = {
  sku: {
    isString: { errorMessage: 'SKU phải là chuỗi' },
    optional: true,
  },
  name: {
    isString: { errorMessage: 'Tên sản phẩm phải là chuỗi' },
    optional: true,
  },
  unit: {
    isString: { errorMessage: 'Đơn vị tính phải là chuỗi' },
    optional: true,
  },
  search: {
    isString: { errorMessage: 'Từ khóa tìm kiếm phải là chuỗi' },
    optional: true,
  },
};

// API tạo sản phẩm (UC01)
router.post(
  '/',
  auth,
  role(['Admin', 'Staff']),
  validate(productValidationSchema),
  productController.createProduct
);

// API cập nhật sản phẩm (UC01)
router.put(
  '/:id',
  auth,
  role(['Admin', 'Staff']),
  validate(productValidationSchema),
  productController.updateProduct
);

// API xóa sản phẩm (UC01)
router.delete(
  '/:id',
  auth,
  role(['Admin']),
  productController.deleteProduct
);

// API lấy chi tiết sản phẩm (UC01)
router.get(
  '/:id',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  productController.getProductById
);

// API tra cứu sản phẩm (UC01)
router.get(
  '/',
  auth,
  role(['Admin', 'Staff', 'Accountant']),
  validate(searchValidationSchema),
  productController.searchProducts
);

module.exports = router;