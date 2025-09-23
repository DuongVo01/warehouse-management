const InventoryBalance = require('../../models/InventoryBalance');

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

// Lấy thống kê dashboard
const getStats = async (req, res) => {
  try {
    const balances = await InventoryBalance.find()
      .populate('productId');
    
    const totalProducts = balances.length;
    const totalValue = balances.reduce((sum, item) => {
      const costPrice = item.productId?.costPrice || 0;
      const quantity = Math.max(0, item.quantity); // Chỉ tính số lượng dương
      return sum + (quantity * costPrice);
    }, 0);
    
    const lowStockCount = balances.filter(item => item.quantity <= 10).length;
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30*24*60*60*1000);
    
    const expiredCount = balances.filter(item => {
      const expiryDate = item.productId?.expiryDate;
      return expiryDate && new Date(expiryDate) < now;
    }).length;
    
    const expiringCount = balances.filter(item => {
      const expiryDate = item.productId?.expiryDate;
      return expiryDate && new Date(expiryDate) >= now && new Date(expiryDate) <= thirtyDaysFromNow;
    }).length;
    
    const stats = {
      totalProducts,
      totalValue,
      lowStockCount,
      expiringCount,
      expiredCount
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInventoryBalance,
  getStats
};