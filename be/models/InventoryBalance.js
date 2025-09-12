const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const InventoryBalance = sequelize.define('InventoryBalance', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'ProductID',
    },
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  LastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inventory_balance',
  timestamps: false,
});

module.exports = InventoryBalance;