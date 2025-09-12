const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validate } = require('../middleware/validator');

// Schema validation cho supplier
const supplierSchema = {
  name: {
    isString: { errorMessage: 'Tên nhà cung cấp phải là chuỗi' },
    notEmpty: { errorMessage: 'Tên nhà cung cấp là bắt buộc' }
  },
  email: {
    isEmail: { errorMessage: 'Email không hợp lệ' },
    optional: true
  },
  phone: {
    isString: { errorMessage: 'Số điện thoại phải là chuỗi' },
    optional: true
  }
};

// API tạo nhà cung cấp
router.post(
  '/',
  auth,
  role(['Admin']),
  validate(supplierSchema),
  supplierController.createSupplier
);

// API cập nhật nhà cung cấp
router.put(
  '/:id',
  auth,
  role(['Admin']),
  validate(supplierSchema),
  supplierController.updateSupplier
);

// API xóa nhà cung cấp
router.delete(
  '/:id',
  auth,
  role(['Admin']),
  supplierController.deleteSupplier
);

// API chi tiết nhà cung cấp
router.get(
  '/:id',
  auth,
  role(['Admin', 'Staff']),
  supplierController.getSupplierById
);

// API danh sách nhà cung cấp
router.get(
  '/',
  auth,
  role(['Admin', 'Staff']),
  supplierController.getAllSuppliers
);

module.exports = router;