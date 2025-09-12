const { Report, InventoryTransaction, InventoryBalance, Product, Supplier } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// UC06 - Tạo báo cáo nhập xuất
const generateImportExportReport = async (req, res) => {
  try {
    const { startDate, endDate, type = 'Import' } = req.query;
    
    const where = {
      TransactionType: type,
      CreatedAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };

    const transactions = await InventoryTransaction.findAll({
      where,
      include: [
        { model: Product, attributes: ['SKU', 'Name', 'Unit'] },
        { model: Supplier, attributes: ['Name'] }
      ],
      order: [['CreatedAt', 'DESC']]
    });

    // Tạo file báo cáo (giả lập)
    const fileName = `${type.toLowerCase()}_report_${Date.now()}.json`;
    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    
    // Đảm bảo thư mục tồn tại
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

    // Lưu thông tin báo cáo
    const report = await Report.create({
      ReportType: type,
      FilePath: filePath,
      CreatedBy: req.user.UserID
    });

    res.json({
      success: true,
      data: {
        report,
        summary: {
          totalTransactions: transactions.length,
          totalQuantity: transactions.reduce((sum, t) => sum + Math.abs(t.Quantity), 0),
          totalValue: transactions.reduce((sum, t) => sum + (Math.abs(t.Quantity) * (t.UnitPrice || 0)), 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC06 - Báo cáo tồn kho
const generateInventoryReport = async (req, res) => {
  try {
    const balances = await InventoryBalance.findAll({
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit', 'CostPrice', 'SalePrice', 'Location']
      }],
      order: [['LastUpdated', 'DESC']]
    });

    // Tạo file báo cáo
    const fileName = `inventory_report_${Date.now()}.json`;
    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(balances, null, 2));

    const report = await Report.create({
      ReportType: 'Inventory',
      FilePath: filePath,
      CreatedBy: req.user.UserID
    });

    res.json({
      success: true,
      data: {
        report,
        summary: {
          totalProducts: balances.length,
          totalQuantity: balances.reduce((sum, b) => sum + b.Quantity, 0),
          totalValue: balances.reduce((sum, b) => sum + (b.Quantity * (b.Product?.CostPrice || 0)), 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC06 - Báo cáo hàng sắp hết hạn
const generateExpiryReport = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    const products = await Product.findAll({
      where: {
        ExpiryDate: {
          [Op.lte]: expiryDate,
          [Op.gte]: new Date()
        }
      },
      include: [{
        model: InventoryBalance,
        where: { Quantity: { [Op.gt]: 0 } }
      }],
      order: [['ExpiryDate', 'ASC']]
    });

    const fileName = `expiry_report_${Date.now()}.json`;
    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    const report = await Report.create({
      ReportType: 'Expiry',
      FilePath: filePath,
      CreatedBy: req.user.UserID
    });

    res.json({
      success: true,
      data: {
        report,
        summary: {
          totalProducts: products.length,
          totalQuantity: products.reduce((sum, p) => sum + (p.InventoryBalance?.Quantity || 0), 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC06 - Báo cáo hàng tồn thấp
const generateLowStockReport = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await InventoryBalance.findAll({
      where: {
        Quantity: { [Op.lte]: parseInt(threshold) }
      },
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit', 'Location']
      }],
      order: [['Quantity', 'ASC']]
    });

    const fileName = `low_stock_report_${Date.now()}.json`;
    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(lowStockProducts, null, 2));

    const report = await Report.create({
      ReportType: 'LowStock',
      FilePath: filePath,
      CreatedBy: req.user.UserID
    });

    res.json({
      success: true,
      data: {
        report,
        summary: {
          totalProducts: lowStockProducts.length,
          totalQuantity: lowStockProducts.reduce((sum, p) => sum + p.Quantity, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách báo cáo đã tạo
const getReports = async (req, res) => {
  try {
    const { ReportType, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (ReportType) where.ReportType = ReportType;

    const reports = await Report.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['FullName']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: reports.rows,
      pagination: {
        total: reports.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(reports.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateImportExportReport,
  generateInventoryReport,
  generateExpiryReport,
  generateLowStockReport,
  getReports,
};