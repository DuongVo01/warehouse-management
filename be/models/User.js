const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  FullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('Admin', 'Staff', 'Accountant'),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  Phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: false,
});

module.exports = User;