// User roles
const USER_ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  ACCOUNTANT: 'Accountant'
};

// Transaction types
const TRANSACTION_TYPES = {
  IMPORT: 'Import',
  EXPORT: 'Export',
  ADJUST: 'Adjust'
};

// Stock check status
const STOCK_CHECK_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

// Report types
const REPORT_TYPES = {
  IMPORT: 'Import',
  EXPORT: 'Export',
  INVENTORY: 'Inventory',
  EXPIRY: 'Expiry',
  LOW_STOCK: 'LowStock'
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Chưa xác thực',
  FORBIDDEN: 'Không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  DUPLICATE_ERROR: 'Dữ liệu đã tồn tại',
  INSUFFICIENT_STOCK: 'Không đủ hàng trong kho',
  INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác'
};

// Success messages
const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  IMPORTED: 'Nhập kho thành công',
  EXPORTED: 'Xuất kho thành công',
  APPROVED: 'Duyệt thành công',
  REJECTED: 'Từ chối thành công'
};

// Default values
const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  LOW_STOCK_THRESHOLD: 10,
  EXPIRY_WARNING_DAYS: 30,
  LARGE_TRANSACTION_THRESHOLD: 10000000, // 10 triệu VNĐ
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['xlsx', 'pdf', 'csv']
};

// Regex patterns
const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/,
  TAX_CODE: /^[0-9]{10}(-[0-9]{3})?$/,
  SKU: /^[A-Z0-9-_]{3,50}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

module.exports = {
  USER_ROLES,
  TRANSACTION_TYPES,
  STOCK_CHECK_STATUS,
  REPORT_TYPES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULTS,
  REGEX_PATTERNS
};