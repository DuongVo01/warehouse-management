const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const InventoryTransaction = require('../models/InventoryTransaction');
const InventoryBalance = require('../models/InventoryBalance');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

class ReportService {
  // Tạo báo cáo Excel
  static async generateExcelReport(data, reportType, filePath) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(reportType);

    switch (reportType) {
      case 'Import':
      case 'Export':
        worksheet.columns = [
          { header: 'Mã giao dịch', key: 'transactionId', width: 15 },
          { header: 'SKU', key: 'sku', width: 15 },
          { header: 'Tên sản phẩm', key: 'productName', width: 30 },
          { header: 'Số lượng', key: 'quantity', width: 12 },
          { header: 'Đơn giá', key: 'unitPrice', width: 15 },
          { header: 'Nhà cung cấp', key: 'supplierName', width: 25 },
          { header: 'Ngày tạo', key: 'createdAt', width: 20 }
        ];
        
        data.forEach(item => {
          worksheet.addRow({
            transactionId: item._id,
            sku: item.productId?.sku,
            productName: item.productId?.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            supplierName: item.supplierId?.name,
            createdAt: item.createdAt
          });
        });
        break;

      case 'Inventory':
        worksheet.columns = [
          { header: 'SKU', key: 'sku', width: 15 },
          { header: 'Tên sản phẩm', key: 'productName', width: 30 },
          { header: 'Đơn vị', key: 'unit', width: 10 },
          { header: 'Tồn kho', key: 'quantity', width: 12 },
          { header: 'Giá nhập', key: 'costPrice', width: 15 },
          { header: 'Giá trị', key: 'value', width: 15 },
          { header: 'Vị trí', key: 'location', width: 15 }
        ];

        data.forEach(item => {
          const value = item.quantity * (item.productId?.costPrice || 0);
          worksheet.addRow({
            sku: item.productId?.sku,
            productName: item.productId?.name,
            unit: item.productId?.unit,
            quantity: item.quantity,
            costPrice: item.productId?.costPrice,
            value: value,
            location: item.productId?.location
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
      doc.text(`${index + 1}. ${item.productId?.name || 'N/A'} - SL: ${item.quantity || 0}`);
    });

    if (data.length > 20) {
      doc.text(`... và ${data.length - 20} mục khác`);
    }

    doc.end();
    return filePath;
  }

  // Lấy dữ liệu báo cáo nhập/xuất
  static async getImportExportData(startDate, endDate, type) {
    return await InventoryTransaction.find({
      transactionType: type,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .populate('productId', 'sku name unit')
    .populate('supplierId', 'name')
    .sort({ createdAt: -1 });
  }

  // Lấy dữ liệu báo cáo tồn kho
  static async getInventoryData() {
    return await InventoryBalance.find()
      .populate('productId', 'sku name unit costPrice location')
      .sort({ lastUpdated: -1 });
  }

  // Lấy dữ liệu hàng sắp hết hạn
  static async getExpiryData(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    const products = await Product.find({
      expiryDate: {
        $lte: expiryDate,
        $gte: new Date()
      }
    }).sort({ expiryDate: 1 });

    // Lấy tồn kho cho các sản phẩm này
    const productIds = products.map(p => p._id);
    const balances = await InventoryBalance.find({
      productId: { $in: productIds },
      quantity: { $gt: 0 }
    }).populate('productId');

    return balances;
  }

  // Tạo thống kê tổng quan
  static async generateSummaryStats(startDate, endDate) {
    const [importStats, exportStats, inventoryValue] = await Promise.all([
      InventoryTransaction.aggregate([
        {
          $match: {
            transactionType: 'Import',
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalQuantity: { $sum: '$quantity' },
            totalValue: { $sum: { $multiply: ['$quantity', '$unitPrice'] } }
          }
        }
      ]),
      InventoryTransaction.aggregate([
        {
          $match: {
            transactionType: 'Export',
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalQuantity: { $sum: { $abs: '$quantity' } }
          }
        }
      ]),
      this.calculateInventoryValue()
    ]);

    return {
      import: importStats[0] || { count: 0, totalQuantity: 0, totalValue: 0 },
      export: exportStats[0] || { count: 0, totalQuantity: 0 },
      inventoryValue
    };
  }

  static async calculateInventoryValue() {
    const result = await InventoryBalance.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ['$quantity', '$product.costPrice'] }
          }
        }
      }
    ]);

    return result[0]?.totalValue || 0;
  }
}

module.exports = ReportService;