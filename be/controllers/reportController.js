const Report = require('../models/Report');
const InventoryTransaction = require('../models/InventoryTransaction');
const InventoryBalance = require('../models/InventoryBalance');
const path = require('path');
const fs = require('fs');

// Tạo báo cáo nhập xuất
const generateTransactionReport = async (req, res) => {
  try {
    const { startDate, endDate, transactionType } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (transactionType) {
      filter.transactionType = transactionType;
    }

    const transactions = await InventoryTransaction.find(filter)
      .populate('productId', 'sku name unit')
      .populate('supplierId', 'name')
      .populate('createdBy', 'fullName employeeCode')
      .sort({ createdAt: -1 });

    // Tạo file CSV
    const fileName = `transaction_report_${Date.now()}.csv`;
    const filePath = path.join('./reports', fileName);
    
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports', { recursive: true });
    }

    const csvContent = generateTransactionCSV(transactions);
    fs.writeFileSync(filePath, csvContent);

    // Lưu thông tin báo cáo
    const report = new Report({
      reportType: transactionType || 'Transaction',
      filePath,
      createdBy: req.user._id
    });
    await report.save();

    res.json({ 
      success: true, 
      data: { 
        report,
        downloadUrl: `/api/reports/download/${report._id}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo báo cáo tồn kho
const generateBalanceReport = async (req, res) => {
  try {
    const balances = await InventoryBalance.find()
      .populate('productId', 'sku name unit costPrice salePrice')
      .sort({ 'productId.name': 1 });

    // Tạo file CSV
    const fileName = `balance_report_${Date.now()}.csv`;
    const filePath = path.join('./reports', fileName);
    
    const csvContent = generateBalanceCSV(balances);
    fs.writeFileSync(filePath, csvContent);

    // Lưu thông tin báo cáo
    const report = new Report({
      reportType: 'Balance',
      filePath,
      createdBy: req.user._id
    });
    await report.save();

    res.json({ 
      success: true, 
      data: { 
        report,
        downloadUrl: `/api/reports/download/${report._id}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper functions
const generateTransactionCSV = (transactions) => {
  const headers = ['Ngày', 'Loại', 'SKU', 'Tên sản phẩm', 'Số lượng', 'Đơn giá', 'Nhà cung cấp', 'Người tạo'];
  const rows = transactions.map(t => [
    t.createdAt.toLocaleDateString('vi-VN'),
    t.transactionType === 'Import' ? 'Nhập' : 'Xuất',
    t.productId?.sku || '',
    t.productId?.name || '',
    Math.abs(t.quantity),
    t.unitPrice || 0,
    t.supplierId?.name || t.customerInfo || '',
    t.createdBy?.fullName || ''
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateBalanceCSV = (balances) => {
  const headers = ['SKU', 'Tên sản phẩm', 'Đơn vị', 'Tồn kho', 'Giá vốn', 'Giá bán', 'Giá trị tồn'];
  const rows = balances.map(b => [
    b.productId?.sku || '',
    b.productId?.name || '',
    b.productId?.unit || '',
    b.quantity,
    b.productId?.costPrice || 0,
    b.productId?.salePrice || 0,
    (b.quantity * (b.productId?.costPrice || 0))
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

module.exports = {
  generateTransactionReport,
  generateBalanceReport
};