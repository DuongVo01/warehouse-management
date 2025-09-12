const { StockCheck, InventoryBalance, Product, User } = require('../models');
const { sequelize } = require('../config/database-sqlite');

// UC05 - Tạo phiếu kiểm kê
const createStockCheck = async (req, res) => {
  try {
    const { ProductID, ActualQty, Note } = req.body;
    
    // Lấy số lượng hệ thống
    const balance = await InventoryBalance.findOne({ where: { ProductID } });
    const SystemQty = balance ? balance.Quantity : 0;
    const Difference = ActualQty - SystemQty;

    const stockCheck = await StockCheck.create({
      ProductID,
      SystemQty,
      ActualQty,
      Difference,
      CreatedBy: req.user.UserID,
      Status: 'Pending'
    });

    res.status(201).json({ success: true, data: stockCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC05 - Duyệt phiếu kiểm kê
const approveStockCheck = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' hoặc 'Rejected'
    
    const stockCheck = await StockCheck.findByPk(id);
    if (!stockCheck) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu kiểm kê' });
    }

    if (stockCheck.Status !== 'Pending') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Phiếu kiểm kê đã được xử lý' });
    }

    // Cập nhật trạng thái phiếu kiểm kê
    await stockCheck.update({
      Status: status,
      ApprovedBy: req.user.UserID
    }, { transaction });

    // Nếu duyệt và có chênh lệch, cập nhật tồn kho
    if (status === 'Approved' && stockCheck.Difference !== 0) {
      const [balance] = await InventoryBalance.findOrCreate({
        where: { ProductID: stockCheck.ProductID },
        defaults: { Quantity: 0 },
        transaction
      });

      await balance.update({
        Quantity: stockCheck.ActualQty,
        LastUpdated: new Date()
      }, { transaction });
    }

    await transaction.commit();
    res.json({ success: true, data: stockCheck });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách phiếu kiểm kê
const getStockChecks = async (req, res) => {
  try {
    const { Status, ProductID, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (Status) where.Status = Status;
    if (ProductID) where.ProductID = ProductID;

    const stockChecks = await StockCheck.findAndCountAll({
      where,
      include: [
        { model: Product, attributes: ['SKU', 'Name'] },
        { model: User, as: 'Creator', attributes: ['FullName'] },
        { model: User, as: 'Approver', attributes: ['FullName'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: stockChecks.rows,
      pagination: {
        total: stockChecks.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(stockChecks.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Chi tiết phiếu kiểm kê
const getStockCheckById = async (req, res) => {
  try {
    const stockCheck = await StockCheck.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ['SKU', 'Name', 'Unit'] },
        { model: User, as: 'Creator', attributes: ['FullName'] },
        { model: User, as: 'Approver', attributes: ['FullName'] }
      ]
    });

    if (!stockCheck) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu kiểm kê' });
    }

    res.json({ success: true, data: stockCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStockCheck,
  approveStockCheck,
  getStockChecks,
  getStockCheckById,
};