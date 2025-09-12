class ValidationHelper {
  // Kiểm tra email hợp lệ
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Kiểm tra số điện thoại Việt Nam
  static isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  // Kiểm tra mã số thuế
  static isValidTaxCode(taxCode) {
    const taxRegex = /^[0-9]{10}(-[0-9]{3})?$/;
    return taxRegex.test(taxCode);
  }

  // Kiểm tra SKU hợp lệ
  static isValidSKU(sku) {
    const skuRegex = /^[A-Z0-9-_]{3,50}$/;
    return skuRegex.test(sku);
  }

  // Kiểm tra giá tiền hợp lệ
  static isValidPrice(price) {
    return !isNaN(price) && parseFloat(price) >= 0;
  }

  // Kiểm tra số lượng hợp lệ
  static isValidQuantity(quantity) {
    return Number.isInteger(quantity) && quantity >= 0;
  }

  // Sanitize string input
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  // Kiểm tra password mạnh
  static isStrongPassword(password) {
    // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Validate pagination parameters
  static validatePagination(page, limit) {
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    return { page: validPage, limit: validLimit };
  }

  // Validate date range
  static validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Ngày không hợp lệ');
    }
    
    if (start > end) {
      throw new Error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }
    
    return { startDate: start, endDate: end };
  }

  // Validate enum values
  static validateEnum(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
      throw new Error(`${fieldName} phải là một trong: ${allowedValues.join(', ')}`);
    }
    return value;
  }

  // Validate required fields
  static validateRequired(obj, requiredFields) {
    const missing = requiredFields.filter(field => !obj[field]);
    if (missing.length > 0) {
      throw new Error(`Thiếu trường bắt buộc: ${missing.join(', ')}`);
    }
  }
}

module.exports = ValidationHelper;