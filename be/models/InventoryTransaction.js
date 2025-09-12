const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const InventoryTransaction = sequelize.define('InventoryTransaction', {
  TransactionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'ProductID',
    },
  },
  TransactionType: {
    type: DataTypes.ENUM('Import', 'Export', 'Adjust'),
    allowNull: false,
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UnitPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'suppliers',
      key: 'SupplierID',
    },
  },
  CustomerInfo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Note: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
}, {
  tableName: 'inventory_transactions',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = InventoryTransaction;