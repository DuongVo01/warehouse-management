const InventoryTransaction = require('../models/InventoryTransaction');
const InventoryBalance = require('../models/InventoryBalance');
const Product = require('../models/Product');

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

    // Tạo transaction
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

    // Cập nhật tồn kho
    await updateInventoryBalance(productId, quantity);

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xuất kho
const exportInventory = async (req, res) => {
  try {
    const { productId, quantity, customerInfo, note } = req.body;
    
    console.log('Export request:', { productId, quantity, customerInfo, note });
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    // Kiểm tra tồn kho
    const balance = await InventoryBalance.findOne({ productId });
    console.log('Found balance:', balance);
    
    if (!balance || balance.quantity < quantity) {
      console.log('Stock check failed:', { 
        balanceExists: !!balance, 
        currentStock: balance?.quantity, 
        requestedQuantity: quantity 
      });
      return res.status(400).json({ 
        success: false, 
        message: `Không đủ hàng trong kho. Hiện tại: ${balance?.quantity || 0}, Yêu cầu: ${quantity}` 
      });
    }

    // Tạo transaction
    const transaction = new InventoryTransaction({
      productId,
      transactionType: 'Export',
      quantity: -quantity,
      customerInfo,
      note,
      createdBy: req.user?._id
    });

    await transaction.save();

    // Cập nhật tồn kho
    await updateInventoryBalance(productId, -quantity);

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tồn kho
const getInventoryBalance = async (req, res) => {
  try {
    const balances = await InventoryBalance.find()
      .populate('productId', 'sku name unit costPrice salePrice expiryDate location isActive')
      .sort({ lastUpdated: -1 });
    
    res.json({ success: true, data: balances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function cập nhật tồn kho
const updateInventoryBalance = async (productId, quantityChange) => {
  const balance = await InventoryBalance.findOne({ productId });
  
  if (balance) {
    balance.quantity += quantityChange;
    balance.lastUpdated = new Date();
    await balance.save();
  } else {
    await InventoryBalance.create({
      productId,
      quantity: Math.max(0, quantityChange),
      lastUpdated: new Date()
    });
  }
};

// Lấy thống kê dashboard
const getStats = async (req, res) => {
  try {
    const balances = await InventoryBalance.find()
      .populate('productId', 'sku name unit costPrice salePrice expiryDate location isActive');
    
    // Tính toán thống kê
    const totalProducts = balances.length;
    const totalValue = balances.reduce((sum, item) => {
      const costPrice = item.productId?.costPrice || 0;
      return sum + (item.quantity * costPrice);
    }, 0);
    
    const lowStockCount = balances.filter(item => item.quantity <= 10).length;
    
    const expiringCount = balances.filter(item => {
      const expiryDate = item.productId?.expiryDate;
      return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
    }).length;
    
    const stats = {
      totalProducts,
      totalValue,
      lowStockCount,
      expiringCount
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách giao dịch
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, transactionType, limit = 100 } = req.query;
    
    let filter = {};
    
    // Lọc theo ngày
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Đến cuối ngày
      
      filter.createdAt = {
        $gte: start,
        $lte: end
      };
    }
    
    // Lọc theo loại giao dịch
    if (transactionType) {
      filter.transactionType = transactionType;
    }
    
    const transactions = await InventoryTransaction.find(filter)
      .populate('productId', 'sku name unit costPrice salePrice')
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
  getInventoryBalance,
  getStats,
  getTransactions
};