const dotenv = require('dotenv');
const path = require('path');

// Load biến môi trường từ file .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Cấu hình các biến môi trường với giá trị mặc định
const envConfig = {
  // Môi trường ứng dụng
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Cổng server
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // Cấu hình database (dùng trong config/database.js)
  DB_NAME: process.env.DB_NAME || 'warehouse_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,

  // JWT cho xác thực (bảo mật theo requirements.md)
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

  // Cấu hình logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Cấu hình API (nếu cần mở rộng tích hợp)
  API_PREFIX: process.env.API_PREFIX || '/api',

  // Cấu hình export báo cáo (theo UC06 trong usecases.md)
  REPORT_EXPORT_PATH: process.env.REPORT_EXPORT_PATH || './reports',
};

// Validate các biến môi trường bắt buộc (chỉ JWT_SECRET cho SQLite)
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!envConfig[envVar]) {
    console.error(`Lỗi: Biến môi trường ${envVar} không được định nghĩa trong .env`);
    process.exit(1);
  }
}

// Xuất cấu hình
module.exports = envConfig;