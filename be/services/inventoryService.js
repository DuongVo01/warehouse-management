const InventoryTransaction = require('../models/InventoryTransaction');
const InventoryBalance = require('../models/InventoryBalance');
const Product = require('../models/Product');
const mongoose = require('mongoose');

class InventoryService {
  // Cập nhật tồn kho sau giao dịch
  static async updateBalance(productId, quantity) {
    const balance = await InventoryBalance.findOne({ productId });

    if (balance) {
      balance.quantity += quantity;
      balance.lastUpdated = new Date();
      await balance.save();
    } else {
      await InventoryBalance.create({
        productId,
        quantity: Math.max(0, quantity),
        lastUpdated: new Date()
      });
    }

    return balance;
  }

  // Kiểm tra tồn kho có đủ không
  static async checkStock(productId, requiredQuantity) {
    const balance = await InventoryBalance.findOne({ productId });
    const currentStock = balance ? balance.quantity : 0;
    
    return {
      available: currentStock,
      sufficient: currentStock >= requiredQuantity,
      shortage: Math.max(0, requiredQuantity - currentStock)
    };
  }

  // Lấy danh sách sản phẩm tồn thấp
  static async getLowStockProducts(threshold = 10) {
    return await InventoryBalance.find({
      quantity: { $lte: threshold }
    })
    .populate('productId', 'sku name unit')
    .sort({ quantity: 1 });
  }

  // Tính tổng giá trị tồn kho
  static async calculateInventoryValue() {
    const balances = await InventoryBalance.find()
      .populate('productId', 'costPrice');

    return balances.reduce((total, balance) => {
      const costPrice = balance.productId?.costPrice || 0;
      return total + (balance.quantity * costPrice);
    }, 0);
  }

  // Xử lý nhập kho hàng loạt
  static async bulkImport(items, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const results = [];

      for (const item of items) {
        const { productId, quantity, unitPrice, supplierId, note } = item;

        // Tạo giao dịch
        const inventoryTransaction = new InventoryTransaction({
          productId,
          transactionType: 'Import',
          quantity,
          unitPrice,
          supplierId,
          note,
          createdBy: userId
        });

        await inventoryTransaction.save({ session });

        // Cập nhật tồn kho
        await this.updateBalance(productId, quantity);
        results.push(inventoryTransaction);
      }

      await session.commitTransaction();
      return results;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = InventoryService;