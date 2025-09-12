const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SKU: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  Name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  Unit: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  CostPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  SalePrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  ExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Location: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = Product;