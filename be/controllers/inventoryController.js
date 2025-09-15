const { InventoryTransaction, InventoryBalance, Product, Supplier, User } = require('../models');
const { sequelize } = require('../config/database-sqlite');
const { Op } = require('sequelize');

// UC02 - Nhập kho
const importInventory = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { productID, quantity, unitPrice, supplierID, note } = req.body;
    const ProductID = productID;
    const Quantity = quantity;
    const UnitPrice = unitPrice;
    const SupplierID = supplierID;
    const Note = note;
    
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(ProductID);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!Quantity || Quantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Số lượng phải lớn hơn 0' });
    }

    if (!UnitPrice || UnitPrice < 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Đơn giá không hợp lệ' });
    }

    // Kiểm tra user
    if (!req.user || !req.user.UserID) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng' });
    }

    // Kiểm tra supplier nếu có
    if (SupplierID) {
      const { Supplier } = require('../models');
      const supplier = await Supplier.findByPk(SupplierID);
      if (!supplier) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
      }
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
    const { productID, quantity, customerInfo, note } = req.body;
    const ProductID = productID;
    const Quantity = quantity;
    const CustomerInfo = customerInfo;
    const Note = note;

    // Kiểm tra user
    if (!req.user || !req.user.UserID) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng' });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(ProductID);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!Quantity || Quantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Số lượng phải lớn hơn 0' });
    }
    
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
    const { ProductID, search, page = 1, limit = 10 } = req.query;
    console.log('Backend search params:', { ProductID, search, page, limit });
    const where = {};
    const productWhere = {};
    
    if (ProductID) where.ProductID = ProductID;
    
    // Tìm kiếm theo tên sản phẩm, SKU hoặc vị trí
    if (search && search.trim()) {
      const searchTerm = search.trim();
      productWhere[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('Product.Name')), 'LIKE', `%${searchTerm.toLowerCase()}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('Product.SKU')), 'LIKE', `%${searchTerm.toLowerCase()}%`),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('Product.Location')), 'LIKE', `%${searchTerm.toLowerCase()}%`)
      ];
      console.log('Product where condition:', JSON.stringify(productWhere, null, 2));
    }

    const includeOptions = {
      model: Product,
      attributes: ['SKU', 'Name', 'Unit', 'Location', 'ExpiryDate']
    };
    
    if (Object.keys(productWhere).length > 0) {
      includeOptions.where = productWhere;
      includeOptions.required = true; // INNER JOIN để chỉ lấy sản phẩm khớp điều kiện
    }

    const balances = await InventoryBalance.findAndCountAll({
      where,
      include: [includeOptions],
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

// Sản phẩm sắp hết hạn
const getExpiringProducts = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + parseInt(days));

    const expiringProducts = await InventoryBalance.findAll({
      include: [{
        model: Product,
        where: {
          ExpiryDate: {
            [Op.lte]: expiryThreshold,
            [Op.gte]: new Date()
          },
          IsActive: true
        },
        attributes: ['SKU', 'Name', 'Unit', 'ExpiryDate', 'Location']
      }],
      where: {
        Quantity: { [Op.gt]: 0 }
      },
      order: [[Product, 'ExpiryDate', 'ASC']]
    });

    res.json({
      success: true,
      data: expiringProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sản phẩm sắp hết hàng
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await InventoryBalance.findAll({
      include: [{
        model: Product,
        where: { IsActive: true },
        attributes: ['SKU', 'Name', 'Unit', 'Location']
      }],
      where: {
        Quantity: { [Op.lte]: parseInt(threshold) }
      },
      order: [['Quantity', 'ASC']]
    });

    res.json({
      success: true,
      data: lowStockProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thống kê tổng quan kho
const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await Product.count({ where: { IsActive: true } });
    const totalQuantity = await InventoryBalance.sum('Quantity');
    const lowStockCount = await InventoryBalance.count({
      where: { Quantity: { [Op.lte]: 10 } },
      include: [{ model: Product, where: { IsActive: true } }]
    });
    
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + 30);
    const expiringCount = await InventoryBalance.count({
      where: { Quantity: { [Op.gt]: 0 } },
      include: [{
        model: Product,
        where: {
          ExpiryDate: { [Op.lte]: expiryThreshold, [Op.gte]: new Date() },
          IsActive: true
        }
      }]
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalQuantity: totalQuantity || 0,
        lowStockCount,
        expiringCount
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
  getExpiringProducts,
  getLowStockProducts,
  getInventoryStats,
};