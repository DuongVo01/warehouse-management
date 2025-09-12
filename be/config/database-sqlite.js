const { Sequelize } = require('sequelize');
const path = require('path');

// Sử dụng SQLite cho test nhanh
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../warehouse.db'),
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối SQLite thành công.');
  } catch (error) {
    console.error('Lỗi kết nối SQLite:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};