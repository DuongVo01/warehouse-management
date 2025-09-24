const InventoryTransaction = require('../../models/InventoryTransaction');
const InventoryBalance = require('../../models/InventoryBalance');
const NotificationService = require('../../services/notificationService');

// Helper function cập nhật tồn kho
const updateInventoryBalance = async (productId, quantityChange) => {
  const balance = await InventoryBalance.findOne({ productId });
  
  if (balance) {
    const oldQuantity = balance.quantity;
    balance.quantity += quantityChange;
    balance.lastUpdated = new Date();
    await balance.save();
    
    // Kiểm tra nếu tồn kho giảm xuống dưới ngưỡng (10)
    if (oldQuantity > 10 && balance.quantity <= 10) {
      const product = await require('../../models/Product').findById(productId, 'name sku').lean();
      if (product) {
        await NotificationService.notifyLowStock(
          productId,
          balance.quantity,
          product.name,
          product.sku
        );
      }
    }
  } else {
    const newQuantity = Math.max(0, quantityChange);
    await InventoryBalance.create({
      productId,
      quantity: newQuantity,
      lastUpdated: new Date()
    });
    
    // Kiểm tra nếu tồn kho mới đã thấp
    if (newQuantity <= 10) {
      const product = await require('../../models/Product').findById(productId, 'name sku').lean();
      if (product) {
        await NotificationService.notifyLowStock(
          productId,
          newQuantity,
          product.name,
          product.sku
        );
      }
    }
  }
};

// Nhập kho
const importInventory = async (req, res) => {
  try {
    const { productId, quantity, unitPrice, supplierId, note } = req.body;
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    const transaction = new InventoryTransaction({
      productId,
      transactionType: 'Import',
      quantity,
      unitPrice,
      supplierId,
      note,
      createdBy: req.user?._id
    });

    await transaction.save();
    await updateInventoryBalance(productId, quantity);
    
    // Tạo thông báo
    const product = await InventoryTransaction.findById(transaction._id).populate('productId');
    await NotificationService.notifyTransaction(
      req.user._id, 
      'Import', 
      product.productId.name, 
      quantity,
      {
        fullName: req.user.fullName,
        employeeCode: req.user.employeeCode,
        role: req.user.role
      }
    );

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xuất kho
const exportInventory = async (req, res) => {
  try {
    const { productId, quantity, customerInfo, note } = req.body;
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    const balance = await InventoryBalance.findOne({ productId });
    
    if (!balance || balance.quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Không đủ hàng trong kho. Hiện tại: ${balance?.quantity || 0}, Yêu cầu: ${quantity}` 
      });
    }

    const transaction = new InventoryTransaction({
      productId,
      transactionType: 'Export',
      quantity: -quantity,
      customerInfo,
      note,
      createdBy: req.user?._id
    });

    await transaction.save();
    await updateInventoryBalance(productId, -quantity);
    
    // Tạo thông báo
    const product = await InventoryTransaction.findById(transaction._id).populate('productId');
    await NotificationService.notifyTransaction(
      req.user._id, 
      'Export', 
      product.productId.name, 
      quantity,
      {
        fullName: req.user.fullName,
        employeeCode: req.user.employeeCode,
        role: req.user.role
      }
    );

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách giao dịch
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, transactionType, limit = 100 } = req.query;
    
    let filter = {};
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filter.createdAt = { $gte: start, $lte: end };
    }
    
    if (transactionType) {
      filter.transactionType = transactionType;
    }
    
    const transactions = await InventoryTransaction.find(filter)
      .populate('productId')
      .populate('supplierId', 'name')
      .populate('createdBy', 'fullName employeeCode')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  importInventory,
  exportInventory,
  getTransactions
};