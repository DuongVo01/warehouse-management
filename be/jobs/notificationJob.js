const cron = require('node-cron');
const InventoryBalance = require('../models/InventoryBalance');
const NotificationService = require('../services/notificationService');

class NotificationJob {
  static start() {
    // Chạy mỗi ngày lúc 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily notification check...');
      await this.checkLowStock();
      await this.checkExpiringProducts();
    });

    // Chạy mỗi 6 tiếng để kiểm tra sản phẩm sắp hết hạn
    cron.schedule('0 */6 * * *', async () => {
      console.log('Running expiry check...');
      await this.checkExpiringProducts();
    });
  }

  static async checkLowStock() {
    try {
      const lowStockItems = await InventoryBalance.find({ quantity: { $lte: 10 } })
        .populate('productId', 'name sku')
        .lean();

      // Batch process notifications
      const batchSize = 10;
      for (let i = 0; i < lowStockItems.length; i += batchSize) {
        const batch = lowStockItems.slice(i, i + batchSize);
        await Promise.all(
          batch.map(item => {
            if (item.productId) {
              return NotificationService.notifyLowStock(
                item.productId._id,
                item.quantity,
                item.productId.name,
                item.productId.sku
              );
            }
          })
        );
      }
    } catch (error) {
      console.error('Error checking low stock:', error);
    }
  }

  static async checkExpiringProducts() {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(Date.now() + 30*24*60*60*1000);
      
      const expiringItems = await InventoryBalance.find()
        .populate({
          path: 'productId',
          match: { 
            expiryDate: { 
              $gte: now,
              $lte: thirtyDaysFromNow 
            }
          },
          select: 'name sku expiryDate'
        })
        .lean();

      // Batch process notifications
      const batchSize = 10;
      const validItems = expiringItems.filter(item => item.productId && item.productId.expiryDate);
      
      for (let i = 0; i < validItems.length; i += batchSize) {
        const batch = validItems.slice(i, i + batchSize);
        await Promise.all(
          batch.map(item => 
            NotificationService.notifyExpiring(
              item.productId._id,
              item.productId.expiryDate,
              item.productId.name,
              item.productId.sku
            )
          )
        );
      }
    } catch (error) {
      console.error('Error checking expiring products:', error);
    }
  }
}

module.exports = NotificationJob;