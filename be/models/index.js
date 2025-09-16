// MongoDB models - không cần relationships như Sequelize
const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');
const InventoryTransaction = require('./InventoryTransaction');
const InventoryBalance = require('./InventoryBalance');
const StockCheck = require('./StockCheck');
const Report = require('./Report');

module.exports = {
  User,
  Supplier,
  Product,
  InventoryTransaction,
  InventoryBalance,
  StockCheck,
  Report
};