const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Report = sequelize.define('Report', {
  ReportID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ReportType: {
    type: DataTypes.ENUM('Import', 'Export', 'Inventory', 'Expiry', 'LowStock'),
    allowNull: false,
  },
  FilePath: {
    type: DataTypes.STRING(255),
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
}, {
  tableName: 'reports',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = Report;