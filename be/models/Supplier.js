const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Supplier = sequelize.define('Supplier', {
  SupplierID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SupplierCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    field: 'SupplierCode'
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  TaxCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = Supplier;