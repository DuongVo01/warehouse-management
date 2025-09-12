const { InventoryTransaction, InventoryBalance, Product, Supplier, User } = require('../models');
const { sequelize } = require('../config/database-sqlite');

// UC02 - Nhập kho
const importInventory = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { ProductID, Quantity, UnitPrice, SupplierID, Note } = req.body;
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(ProductID);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    // Tạo giao dịch nhập kho
    const inventoryTransaction = await InventoryTransaction.create({
      ProductID,
      TransactionType: 'Import',
      Quantity,
      UnitPrice,
      SupplierID,
      Note,
      CreatedBy: req.user.UserID
    }, { transaction });

    // Cập nhật tồn kho
    const [balance, created] = await InventoryBalance.findOrCreate({
      where: { ProductID },
      defaults: { Quantity: 0 },
      transaction
    });

    await balance.update({
      Quantity: balance.Quantity + Quantity,
      LastUpdated: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ success: true, data: inventoryTransaction });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC03 - Xuất kho
const exportInventory = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { ProductID, Quantity, CustomerInfo, Note } = req.body;
    
    // Kiểm tra tồn kho
    const balance = await InventoryBalance.findOne({ where: { ProductID } });
    if (!balance || balance.Quantity < Quantity) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Không đủ hàng trong kho' });
    }

    // Tạo giao dịch xuất kho
    const inventoryTransaction = await InventoryTransaction.create({
      ProductID,
      TransactionType: 'Export',
      Quantity: -Quantity,
      CustomerInfo,
      Note,
      CreatedBy: req.user.UserID
    }, { transaction });

    // Cập nhật tồn kho
    await balance.update({
      Quantity: balance.Quantity - Quantity,
      LastUpdated: new Date()
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ success: true, data: inventoryTransaction });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC04 - Xem tồn kho
const getInventoryBalance = async (req, res) => {
  try {
    const { ProductID, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (ProductID) where.ProductID = ProductID;

    const balances = await InventoryBalance.findAndCountAll({
      where,
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit', 'Location']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['LastUpdated', 'DESC']]
    });

    res.json({
      success: true,
      data: balances.rows,
      pagination: {
        total: balances.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(balances.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lịch sử giao dịch
const getTransactionHistory = async (req, res) => {
  try {
    const { ProductID, TransactionType, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (ProductID) where.ProductID = ProductID;
    if (TransactionType) where.TransactionType = TransactionType;

    const transactions = await InventoryTransaction.findAndCountAll({
      where,
      include: [
        { model: Product, attributes: ['SKU', 'Name'] },
        { model: Supplier, attributes: ['Name'] },
        { model: User, attributes: ['FullName'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: transactions.rows,
      pagination: {
        total: transactions.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(transactions.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  importInventory,
  exportInventory,
  getInventoryBalance,
  getTransactionHistory,
};