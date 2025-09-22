const InventoryTransaction = require('../models/InventoryTransaction');
const InventoryBalance = require('../models/InventoryBalance');
const Product = require('../models/Product');
const StockCheck = require('../models/StockCheck');

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
      .populate('productId')
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
      .populate('productId');
    
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

// Lấy dữ liệu biểu đồ giao dịch hàng ngày
const getDailyTransactions = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const transactions = await InventoryTransaction.find({
      createdAt: { $gte: startDate }
    }).populate('productId', 'sku name');
    
    // Nhóm theo ngày
    const dailyData = {};
    transactions.forEach(transaction => {
      const date = transaction.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, import: 0, export: 0 };
      }
      
      if (transaction.transactionType === 'Import') {
        dailyData[date].import += Math.abs(transaction.quantity);
      } else {
        dailyData[date].export += Math.abs(transaction.quantity);
      }
    });
    
    const result = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy xu hướng giá trị tồn kho
const getInventoryTrend = async (req, res) => {
  try {
    // Tìm giao dịch đầu tiên để xác định ngày bắt đầu
    const firstTransaction = await InventoryTransaction.findOne().sort({ createdAt: 1 });
    
    if (!firstTransaction) {
      return res.json({ success: true, data: [] });
    }
    
    const startDate = new Date(firstTransaction.createdAt.toISOString().split('T')[0]);
    const endDate = new Date();
    const trendData = [];
    
    // Lấy tất cả giao dịch để tính toán lũy kế
    const allTransactions = await InventoryTransaction.find()
      .populate('productId', 'costPrice')
      .sort({ createdAt: 1 });
    
    // Tính giá trị tồn kho cho từng ngày
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Tính tồn kho tại cuối ngày này
      const productBalances = {};
      
      // Duyệt qua tất cả giao dịch đến cuối ngày này
      allTransactions.forEach(transaction => {
        if (transaction.createdAt <= endOfDay) {
          const productId = transaction.productId._id.toString();
          if (!productBalances[productId]) {
            productBalances[productId] = {
              quantity: 0,
              costPrice: transaction.productId.costPrice || 0
            };
          }
          productBalances[productId].quantity += transaction.quantity;
        }
      });
      
      // Tính tổng giá trị
      const totalValue = Object.values(productBalances).reduce((sum, item) => {
        return sum + (Math.max(0, item.quantity) * item.costPrice);
      }, 0);
      
      trendData.push({
        date: dateStr,
        value: Math.round(totalValue)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({ success: true, data: trendData });
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

// Lấy danh sách kiểm kê
const getStockChecks = async (req, res) => {
  try {
    const stockChecks = await StockCheck.find()
      .populate('productId')
      .populate('createdBy', 'fullName employeeCode')
      .populate('approvedBy', 'fullName employeeCode')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: stockChecks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo phiếu kiểm kê
const createStockCheck = async (req, res) => {
  try {
    const { productId, actualQuantity, note } = req.body;
    
    if (!productId || actualQuantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không xác định được người dùng' 
      });
    }

    // Lấy số lượng tồn kho hiện tại
    const balance = await InventoryBalance.findOne({ productId });
    const systemQuantity = balance ? balance.quantity : 0;

    const stockCheck = new StockCheck({
      productId,
      systemQuantity,
      actualQuantity,
      note,
      createdBy: req.user._id
    });

    await stockCheck.save();
    
    const populatedCheck = await StockCheck.findById(stockCheck._id)
      .populate('productId')
      .populate('createdBy', 'fullName employeeCode');

    res.status(201).json({ success: true, data: populatedCheck });
  } catch (error) {
    console.error('Stock check creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Duyệt phiếu kiểm kê
const approveStockCheck = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stockCheck = await StockCheck.findById(id);
    if (!stockCheck) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu kiểm kê' });
    }
    
    if (stockCheck.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Phiếu kiểm kê đã được xử lý' });
    }

    // Cập nhật trạng thái phiếu
    stockCheck.status = 'Approved';
    stockCheck.approvedBy = req.user._id;
    stockCheck.approvedAt = new Date();
    await stockCheck.save();
    
    // Cập nhật tồn kho và tạo transaction (không làm ảnh hưởng đến response)
    try {
      const difference = stockCheck.actualQuantity - stockCheck.systemQuantity;
      if (difference !== 0) {
        await updateInventoryBalance(stockCheck.productId, difference);
        
        const transaction = new InventoryTransaction({
          productId: stockCheck.productId,
          transactionType: difference > 0 ? 'Adjustment_In' : 'Adjustment_Out',
          quantity: Math.abs(difference),
          note: `Điều chỉnh từ kiểm kê ${stockCheck.checkId}`,
          createdBy: req.user._id
        });
        await transaction.save();
      }
    } catch (inventoryError) {
      console.error('Error updating inventory after approval:', inventoryError);
      // Không throw lỗi, vẫn trả về thành công
    }

    res.json({ success: true, data: stockCheck });
  } catch (error) {
    console.error('Approve stock check error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Từ chối phiếu kiểm kê
const rejectStockCheck = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stockCheck = await StockCheck.findById(id);
    if (!stockCheck) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu kiểm kê' });
    }
    
    if (stockCheck.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Phiếu kiểm kê đã được xử lý' });
    }

    stockCheck.status = 'Rejected';
    stockCheck.approvedBy = req.user._id;
    stockCheck.approvedAt = new Date();
    await stockCheck.save();

    res.json({ success: true, data: stockCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  importInventory,
  exportInventory,
  getInventoryBalance,
  getStats,
  getTransactions,
  getDailyTransactions,
  getInventoryTrend,
  getStockChecks,
  createStockCheck,
  approveStockCheck,
  rejectStockCheck
};