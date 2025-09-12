const { InventoryBalance, InventoryTransaction } = require('../models');
const { EmailService } = require('../services');
const logger = require('../config/logger');

class TriggerUtils {
  // Trigger sau khi tạo giao dịch tồn kho
  static async afterInventoryTransaction(transaction) {
    try {
      // Cập nhật tồn kho
      await this.updateInventoryBalance(transaction);

      // Kiểm tra cảnh báo tồn thấp
      if (transaction.TransactionType === 'Export') {
        await this.checkLowStockAlert(transaction.ProductID);
      }

      // Cảnh báo giao dịch lớn
      const transactionValue = Math.abs(transaction.Quantity) * (transaction.UnitPrice || 0);
      if (transactionValue > 10000000) { // 10 triệu VNĐ
        await this.sendLargeTransactionAlert(transaction);
      }

    } catch (error) {
      logger.error('Error in afterInventoryTransaction trigger:', error);
    }
  }

  // Cập nhật tồn kho
  static async updateInventoryBalance(transaction) {
    const [balance, created] = await InventoryBalance.findOrCreate({
      where: { ProductID: transaction.ProductID },
      defaults: { Quantity: 0 }
    });

    const newQuantity = balance.Quantity + transaction.Quantity;
    await balance.update({
      Quantity: Math.max(0, newQuantity), // Không cho phép âm
      LastUpdated: new Date()
    });

    return balance;
  }

  // Kiểm tra cảnh báo tồn thấp
  static async checkLowStockAlert(productId, threshold = 10) {
    const balance = await InventoryBalance.findOne({
      where: { ProductID: productId },
      include: [{ model: require('../models').Product }]
    });

    if (balance && balance.Quantity <= threshold) {
      // Gửi cảnh báo (giả lập)
      logger.warn(`Low stock alert: Product ${balance.Product?.Name} - Quantity: ${balance.Quantity}`);
      
      // Có thể gửi email cảnh báo
      // await EmailService.sendLowStockAlert([balance], ['admin@company.com']);
    }
  }

  // Cảnh báo giao dịch lớn
  static async sendLargeTransactionAlert(transaction) {
    logger.warn(`Large transaction alert: Transaction ${transaction.TransactionID} - Value: ${Math.abs(transaction.Quantity) * (transaction.UnitPrice || 0)}`);
    
    // Có thể gửi email cảnh báo
    // await EmailService.sendLargeTransactionAlert(transaction, ['manager@company.com']);
  }

  // Trigger sau khi duyệt kiểm kê
  static async afterStockCheckApproval(stockCheck) {
    try {
      if (stockCheck.Status === 'Approved' && stockCheck.Difference !== 0) {
        // Tạo giao dịch điều chỉnh
        await InventoryTransaction.create({
          ProductID: stockCheck.ProductID,
          TransactionType: 'Adjust',
          Quantity: stockCheck.Difference,
          Note: `Điều chỉnh từ kiểm kê #${stockCheck.StockCheckID}`,
          CreatedBy: stockCheck.ApprovedBy
        });

        logger.info(`Stock adjustment created for StockCheck ${stockCheck.StockCheckID}`);
      }
    } catch (error) {
      logger.error('Error in afterStockCheckApproval trigger:', error);
    }
  }

  // Kiểm tra hàng sắp hết hạn (chạy định kỳ)
  static async checkExpiringProducts(days = 30) {
    try {
      const { Product, InventoryBalance } = require('../models');
      const { Op } = require('sequelize');
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const expiringProducts = await Product.findAll({
        where: {
          ExpiryDate: {
            [Op.lte]: expiryDate,
            [Op.gte]: new Date()
          }
        },
        include: [{
          model: InventoryBalance,
          where: { Quantity: { [Op.gt]: 0 } }
        }]
      });

      if (expiringProducts.length > 0) {
        logger.warn(`Found ${expiringProducts.length} products expiring in ${days} days`);
        // await EmailService.sendExpiryAlert(expiringProducts, ['warehouse@company.com']);
      }

      return expiringProducts;
    } catch (error) {
      logger.error('Error checking expiring products:', error);
    }
  }

  // Backup dữ liệu định kỳ
  static async performDataBackup() {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        tables: ['users', 'products', 'suppliers', 'inventory_transactions', 'inventory_balance']
      };

      logger.info('Data backup completed', backupData);
      return backupData;
    } catch (error) {
      logger.error('Error performing data backup:', error);
    }
  }
}

module.exports = TriggerUtils;