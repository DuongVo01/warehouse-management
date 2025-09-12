const { validationResult, checkSchema } = require('express-validator');

// Middleware để xử lý kết quả validation
const validate = (schema) => {
  return [
    checkSchema(schema),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }
      next();
    }
  ];
};

// Schema validation cho các endpoint chính
const schemas = {
  // Product validation
  product: {
    sku: {
      isString: { errorMessage: 'SKU phải là chuỗi' },
      notEmpty: { errorMessage: 'SKU là bắt buộc' },
      isLength: { options: { max: 50 }, errorMessage: 'SKU không được vượt quá 50 ký tự' }
    },
    name: {
      isString: { errorMessage: 'Tên sản phẩm phải là chuỗi' },
      notEmpty: { errorMessage: 'Tên sản phẩm là bắt buộc' },
      isLength: { options: { max: 150 }, errorMessage: 'Tên sản phẩm không được vượt quá 150 ký tự' }
    },
    unit: {
      isString: { errorMessage: 'Đơn vị tính phải là chuỗi' },
      notEmpty: { errorMessage: 'Đơn vị tính là bắt buộc' }
    },
    costPrice: {
      isDecimal: { errorMessage: 'Giá nhập phải là số thập phân' },
      notEmpty: { errorMessage: 'Giá nhập là bắt buộc' }
    },
    salePrice: {
      isDecimal: { errorMessage: 'Giá bán phải là số thập phân' },
      notEmpty: { errorMessage: 'Giá bán là bắt buộc' }
    }
  },

  // User validation
  user: {
    username: {
      isString: { errorMessage: 'Username phải là chuỗi' },
      notEmpty: { errorMessage: 'Username là bắt buộc' },
      isLength: { options: { max: 50 }, errorMessage: 'Username không được vượt quá 50 ký tự' }
    },
    fullName: {
      isString: { errorMessage: 'Họ tên phải là chuỗi' },
      notEmpty: { errorMessage: 'Họ tên là bắt buộc' }
    },
    email: {
      isEmail: { errorMessage: 'Email không hợp lệ' },
      notEmpty: { errorMessage: 'Email là bắt buộc' }
    },
    role: {
      isIn: { 
        options: [['Admin', 'Staff', 'Accountant']], 
        errorMessage: 'Role phải là Admin, Staff hoặc Accountant' 
      }
    }
  },

  // Inventory transaction validation
  inventoryTransaction: {
    productID: {
      isInt: { errorMessage: 'ProductID phải là số nguyên' },
      notEmpty: { errorMessage: 'ProductID là bắt buộc' }
    },
    quantity: {
      isInt: { options: { min: 1 }, errorMessage: 'Số lượng phải là số nguyên dương' },
      notEmpty: { errorMessage: 'Số lượng là bắt buộc' }
    }
  },

  // Stock check validation
  stockCheck: {
    productID: {
      isInt: { errorMessage: 'ProductID phải là số nguyên' },
      notEmpty: { errorMessage: 'ProductID là bắt buộc' }
    },
    actualQty: {
      isInt: { options: { min: 0 }, errorMessage: 'Số lượng thực tế phải là số nguyên không âm' },
      notEmpty: { errorMessage: 'Số lượng thực tế là bắt buộc' }
    }
  }
};

module.exports = {
  validate,
  schemas
};