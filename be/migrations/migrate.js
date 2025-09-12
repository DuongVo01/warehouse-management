const { sequelize } = require('../config/database-sqlite');
// Import models để tạo bảng
require('../models/User');
require('../models/Supplier');
require('../models/Product');
require('../models/InventoryTransaction');
require('../models/InventoryBalance');
require('../models/StockCheck');
require('../models/Report');

const runMigrations = async () => {
  try {
    console.log('Đang kết nối database...');
    await sequelize.authenticate();
    console.log('Kết nối database thành công');

    console.log('Đang tạo bảng...');
    await sequelize.sync({ force: false }); // Không xóa dữ liệu cũ
    console.log('Tạo bảng thành công');

    console.log('Migration hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi migration:', error);
    process.exit(1);
  }
};

runMigrations();