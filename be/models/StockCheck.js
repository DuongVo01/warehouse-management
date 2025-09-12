const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const StockCheck = sequelize.define('StockCheck', {
  StockCheckID: {
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
  SystemQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ActualQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Difference: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  ApprovedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  tableName: 'stock_checks',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = StockCheck;