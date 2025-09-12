const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { InventoryTransaction, InventoryBalance, Product, Supplier } = require('../models');
const { Op } = require('sequelize');

class ReportService {
  // Tạo báo cáo Excel
  static async generateExcelReport(data, reportType, filePath) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(reportType);

    switch (reportType) {
      case 'Import':
      case 'Export':
        worksheet.columns = [
          { header: 'Mã giao dịch', key: 'TransactionID', width: 15 },
          { header: 'SKU', key: 'sku', width: 15 },
          { header: 'Tên sản phẩm', key: 'productName', width: 30 },
          { header: 'Số lượng', key: 'Quantity', width: 12 },
          { header: 'Đơn giá', key: 'UnitPrice', width: 15 },
          { header: 'Nhà cung cấp', key: 'supplierName', width: 25 },
          { header: 'Ngày tạo', key: 'CreatedAt', width: 20 }
        ];
        
        data.forEach(item => {
          worksheet.addRow({
            TransactionID: item.TransactionID,
            sku: item.Product?.SKU,
            productName: item.Product?.Name,
            Quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            supplierName: item.Supplier?.Name,
            CreatedAt: item.CreatedAt
          });
        });
        break;

      case 'Inventory':
        worksheet.columns = [
          { header: 'SKU', key: 'sku', width: 15 },
          { header: 'Tên sản phẩm', key: 'productName', width: 30 },
          { header: 'Đơn vị', key: 'unit', width: 10 },
          { header: 'Tồn kho', key: 'Quantity', width: 12 },
          { header: 'Giá nhập', key: 'costPrice', width: 15 },
          { header: 'Giá trị', key: 'value', width: 15 },
          { header: 'Vị trí', key: 'location', width: 15 }
        ];

        data.forEach(item => {
          const value = item.Quantity * (item.Product?.CostPrice || 0);
          worksheet.addRow({
            sku: item.Product?.SKU,
            productName: item.Product?.Name,
            unit: item.Product?.Unit,
            Quantity: item.Quantity,
            costPrice: item.Product?.CostPrice,
            value: value,
            location: item.Product?.Location
          });
        });
        break;
    }

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  // Tạo báo cáo PDF
  static async generatePDFReport(data, reportType, filePath) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(16).text(`Báo cáo ${reportType}`, { align: 'center' });
    doc.fontSize(12).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
    doc.moveDown();

    // Content (simplified)
    data.slice(0, 20).forEach((item, index) => {
      doc.text(`${index + 1}. ${item.Product?.Name || 'N/A'} - SL: ${item.Quantity || 0}`);
    });

    if (data.length > 20) {
      doc.text(`... và ${data.length - 20} mục khác`);
    }

    doc.end();
    return filePath;
  }

  // Lấy dữ liệu báo cáo nhập/xuất
  static async getImportExportData(startDate, endDate, type) {
    return await InventoryTransaction.findAll({
      where: {
        TransactionType: type,
        CreatedAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        { model: Product, attributes: ['SKU', 'Name', 'Unit'] },
        { model: Supplier, attributes: ['Name'] }
      ],
      order: [['CreatedAt', 'DESC']]
    });
  }

  // Lấy dữ liệu báo cáo tồn kho
  static async getInventoryData() {
    return await InventoryBalance.findAll({
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit', 'CostPrice', 'Location']
      }],
      order: [['LastUpdated', 'DESC']]
    });
  }

  // Lấy dữ liệu hàng sắp hết hạn
  static async getExpiryData(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    return await Product.findAll({
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
  }

  // Tạo thống kê tổng quan
  static async generateSummaryStats(startDate, endDate) {
    const [importStats, exportStats, inventoryValue] = await Promise.all([
      InventoryTransaction.findAll({
        where: {
          TransactionType: 'Import',
          CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
        },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('TransactionID')), 'count'],
          [sequelize.fn('SUM', sequelize.col('Quantity')), 'totalQuantity'],
          [sequelize.fn('SUM', sequelize.literal('Quantity * UnitPrice')), 'totalValue']
        ]
      }),
      InventoryTransaction.findAll({
        where: {
          TransactionType: 'Export',
          CreatedAt: { [Op.between]: [new Date(startDate), new Date(endDate)] }
        },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('TransactionID')), 'count'],
          [sequelize.fn('SUM', sequelize.literal('ABS(Quantity)')), 'totalQuantity']
        ]
      }),
      this.calculateInventoryValue()
    ]);

    return {
      import: importStats[0]?.dataValues || { count: 0, totalQuantity: 0, totalValue: 0 },
      export: exportStats[0]?.dataValues || { count: 0, totalQuantity: 0 },
      inventoryValue
    };
  }

  static async calculateInventoryValue() {
    const balances = await InventoryBalance.findAll({
      include: [{ model: Product, attributes: ['CostPrice'] }]
    });

    return balances.reduce((total, balance) => {
      const costPrice = balance.Product?.CostPrice || 0;
      return total + (balance.Quantity * costPrice);
    }, 0);
  }
}

module.exports = ReportService;