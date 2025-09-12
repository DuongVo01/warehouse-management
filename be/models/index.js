const User = require('./User');
const Supplier = require('./Supplier');
const Product = require('./Product');
const InventoryTransaction = require('./InventoryTransaction');
const InventoryBalance = require('./InventoryBalance');
const StockCheck = require('./StockCheck');
const Report = require('./Report');

// Định nghĩa quan hệ giữa các models

// User relationships
User.hasMany(InventoryTransaction, { foreignKey: 'CreatedBy' });
User.hasMany(StockCheck, { foreignKey: 'CreatedBy', as: 'CreatedStockChecks' });
User.hasMany(StockCheck, { foreignKey: 'ApprovedBy', as: 'ApprovedStockChecks' });
User.hasMany(Report, { foreignKey: 'CreatedBy' });

// Supplier relationships
Supplier.hasMany(InventoryTransaction, { foreignKey: 'SupplierID' });

// Product relationships
Product.hasMany(InventoryTransaction, { foreignKey: 'ProductID' });
Product.hasOne(InventoryBalance, { foreignKey: 'ProductID' });
Product.hasMany(StockCheck, { foreignKey: 'ProductID' });

// Inverse relationships
InventoryTransaction.belongsTo(User, { foreignKey: 'CreatedBy' });
InventoryTransaction.belongsTo(Supplier, { foreignKey: 'SupplierID' });
InventoryTransaction.belongsTo(Product, { foreignKey: 'ProductID' });

InventoryBalance.belongsTo(Product, { foreignKey: 'ProductID' });

StockCheck.belongsTo(Product, { foreignKey: 'ProductID' });
StockCheck.belongsTo(User, { foreignKey: 'CreatedBy', as: 'Creator' });
StockCheck.belongsTo(User, { foreignKey: 'ApprovedBy', as: 'Approver' });

Report.belongsTo(User, { foreignKey: 'CreatedBy' });

module.exports = {
  User,
  Supplier,
  Product,
  InventoryTransaction,
  InventoryBalance,
  StockCheck,
  Report,
};