// config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo kết nối Sequelize
let sequelize;

if (process.env.DB_DIALECT === 'sqlite') {
  // SQLite configuration
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './warehouse.db',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
} else {
  // PostgreSQL configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      timezone: '+00:00',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
      },
    }
  );
}

// Hàm kiểm tra kết nối database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối database thành công.');
  } catch (error) {
    console.error('Lỗi kết nối database:', error.message);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

// Xuất sequelize instance và hàm connectDB
module.exports = {
  sequelize,
  connectDB,
};