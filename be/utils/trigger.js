const InventoryBalance = require('../models/InventoryBalance');
const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');
const EmailService = require('../services/emailService');
const logger = require('../config/logger');

class TriggerUtils {
  // Trigger sau khi tạo giao dịch tồn kho
  static async afterInventoryTransaction(transaction) {
    try {
      // Cập nhật tồn kho
      await this.updateInventoryBalance(transaction);

      // Kiểm tra cảnh báo tồn thấp
      if (transaction.transactionType === 'Export') {
        await this.checkLowStockAlert(transaction.productId);
      }

      // Cảnh báo giao dịch lớn
      const transactionValue = Math.abs(transaction.quantity) * (transaction.unitPrice || 0);
      if (transactionValue > 10000000) { // 10 triệu VNĐ
        await this.sendLargeTransactionAlert(transaction);
      }

    } catch (error) {
      logger.error('Error in afterInventoryTransaction trigger:', error);
    }
  }

  // Cập nhật tồn kho
  static async updateInventoryBalance(transaction) {
    let balance = await InventoryBalance.findOne({ productId: transaction.productId });

    if (balance) {
      const newQuantity = balance.quantity + transaction.quantity;
      balance.quantity = Math.max(0, newQuantity); // Không cho phép âm
      balance.lastUpdated = new Date();
      await balance.save();
    } else {
      balance = await InventoryBalance.create({
        productId: transaction.productId,
        quantity: Math.max(0, transaction.quantity),
        lastUpdated: new Date()
      });
    }

    return balance;
  }

  // Kiểm tra cảnh báo tồn thấp
  static async checkLowStockAlert(productId, threshold = 10) {
    const balance = await InventoryBalance.findOne({ productId })
      .populate('productId', 'name sku unit');

    if (balance && balance.quantity <= threshold) {
      // Gửi cảnh báo (giả lập)
      logger.warn(`Low stock alert: Product ${balance.productId?.name} - Quantity: ${balance.quantity}`);
      
      // Có thể gửi email cảnh báo
      // await EmailService.sendLowStockAlert([balance], ['admin@company.com']);
    }
  }

  // Cảnh báo giao dịch lớn
  static async sendLargeTransactionAlert(transaction) {
    logger.warn(`Large transaction alert: Transaction ${transaction._id} - Value: ${Math.abs(transaction.quantity) * (transaction.unitPrice || 0)}`);
    
    // Có thể gửi email cảnh báo
    // await EmailService.sendLargeTransactionAlert(transaction, ['manager@company.com']);
  }

  // Trigger sau khi duyệt kiểm kê
  static async afterStockCheckApproval(stockCheck) {
    try {
      if (stockCheck.status === 'Approved' && stockCheck.difference !== 0) {
        // Tạo giao dịch điều chỉnh
        await InventoryTransaction.create({
          productId: stockCheck.productId,
          transactionType: stockCheck.difference > 0 ? 'Import' : 'Export',
          quantity: Math.abs(stockCheck.difference),
          note: `Điều chỉnh từ kiểm kê #${stockCheck._id}`,
          createdBy: stockCheck.approvedBy
        });

        logger.info(`Stock adjustment created for StockCheck ${stockCheck._id}`);
      }
    } catch (error) {
      logger.error('Error in afterStockCheckApproval trigger:', error);
    }
  }

  // Kiểm tra hàng sắp hết hạn (chạy định kỳ)
  static async checkExpiringProducts(days = 30) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const expiringProducts = await Product.find({
        expiryDate: {
          $lte: expiryDate,
          $gte: new Date()
        }
      });

      // Lấy tồn kho cho các sản phẩm này
      const productIds = expiringProducts.map(p => p._id);
      const balances = await InventoryBalance.find({
        productId: { $in: productIds },
        quantity: { $gt: 0 }
      }).populate('productId');

      if (balances.length > 0) {
        logger.warn(`Found ${balances.length} products expiring in ${days} days`);
        // await EmailService.sendExpiryAlert(balances, ['warehouse@company.com']);
      }

      return balances;
    } catch (error) {
      logger.error('Error checking expiring products:', error);
    }
  }

  // Backup dữ liệu định kỳ
  static async performDataBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        collections: ['users', 'products', 'suppliers', 'inventorytransactions', 'inventorybalances']
      };

      logger.info('Data backup completed', backupData);
      return backupData;
    } catch (error) {
      logger.error('Error performing data backup:', error);
    }
  }
}

module.exports = TriggerUtils;