const InventoryTransaction = require('../../models/InventoryTransaction');
const InventoryBalance = require('../../models/InventoryBalance');

// Lấy dữ liệu biểu đồ giao dịch hàng ngày
const getDailyTransactions = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const transactions = await InventoryTransaction.find({
      createdAt: { $gte: startDate }
    }).populate('productId', 'sku name');
    
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
    const firstTransaction = await InventoryTransaction.findOne().sort({ createdAt: 1 });
    
    if (!firstTransaction) {
      return res.json({ success: true, data: [] });
    }
    
    const startDate = new Date(firstTransaction.createdAt.toISOString().split('T')[0]);
    const endDate = new Date();
    const trendData = [];
    
    const allTransactions = await InventoryTransaction.find()
      .populate('productId', 'costPrice')
      .sort({ createdAt: 1 });
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const productBalances = {};
      
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

// Đồng bộ tồn kho từ giao dịch
const syncInventoryBalance = async (req, res) => {
  try {
    // Lấy tất cả giao dịch
    const transactions = await InventoryTransaction.find()
      .populate('productId', 'costPrice')
      .sort({ createdAt: 1 });
    
    // Tính toán tồn kho cho từng sản phẩm
    const productBalances = {};
    
    transactions.forEach(transaction => {
      const productId = transaction.productId._id.toString();
      if (!productBalances[productId]) {
        productBalances[productId] = {
          productId: transaction.productId._id,
          quantity: 0
        };
      }
      productBalances[productId].quantity += transaction.quantity;
    });
    
    // Xóa tất cả balance cũ
    await InventoryBalance.deleteMany({});
    
    // Tạo balance mới cho sản phẩm có tồn kho > 0
    const balancesToCreate = Object.values(productBalances)
      .filter(balance => balance.quantity > 0)
      .map(balance => ({
        productId: balance.productId,
        quantity: balance.quantity,
        lastUpdated: new Date()
      }));
    
    if (balancesToCreate.length > 0) {
      await InventoryBalance.insertMany(balancesToCreate);
    }
    
    res.json({ 
      success: true, 
      message: `Đồng bộ thành công ${balancesToCreate.length} sản phẩm`,
      data: balancesToCreate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa tất cả dữ liệu giao dịch và tồn kho
const clearAllData = async (req, res) => {
  try {
    // Xóa tất cả giao dịch
    await InventoryTransaction.deleteMany({});
    
    // Xóa tất cả tồn kho
    await InventoryBalance.deleteMany({});
    
    res.json({ 
      success: true, 
      message: 'Xóa tất cả dữ liệu thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDailyTransactions,
  getInventoryTrend,
  syncInventoryBalance,
  clearAllData
};