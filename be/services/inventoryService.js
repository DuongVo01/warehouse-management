const { InventoryTransaction, InventoryBalance, Product } = require('../models');
const { sequelize } = require('../config/database-sqlite');

class InventoryService {
  // Cập nhật tồn kho sau giao dịch
  static async updateBalance(productId, quantity, transaction = null) {
    const [balance, created] = await InventoryBalance.findOrCreate({
      where: { ProductID: productId },
      defaults: { Quantity: 0 },
      transaction
    });

    await balance.update({
      Quantity: balance.Quantity + quantity,
      LastUpdated: new Date()
    }, { transaction });

    return balance;
  }

  // Kiểm tra tồn kho có đủ không
  static async checkStock(productId, requiredQuantity) {
    const balance = await InventoryBalance.findOne({
      where: { ProductID: productId }
    });

    const currentStock = balance ? balance.Quantity : 0;
    return {
      available: currentStock,
      sufficient: currentStock >= requiredQuantity,
      shortage: Math.max(0, requiredQuantity - currentStock)
    };
  }

  // Lấy danh sách sản phẩm tồn thấp
  static async getLowStockProducts(threshold = 10) {
    return await InventoryBalance.findAll({
      where: {
        Quantity: { [sequelize.Op.lte]: threshold }
      },
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit']
      }],
      order: [['Quantity', 'ASC']]
    });
  }

  // Tính tổng giá trị tồn kho
  static async calculateInventoryValue() {
    const balances = await InventoryBalance.findAll({
      include: [{
        model: Product,
        attributes: ['CostPrice']
      }]
    });

    return balances.reduce((total, balance) => {
      const costPrice = balance.Product?.CostPrice || 0;
      return total + (balance.Quantity * costPrice);
    }, 0);
  }

  // Xử lý nhập kho hàng loạt
  static async bulkImport(items, userId) {
    const transaction = await sequelize.transaction();
    try {
      const results = [];

      for (const item of items) {
        const { ProductID, Quantity, UnitPrice, SupplierID, Note } = item;

        // Tạo giao dịch
        const inventoryTransaction = await InventoryTransaction.create({
          ProductID,
          TransactionType: 'Import',
          Quantity,
          UnitPrice,
          SupplierID,
          Note,
          CreatedBy: userId
        }, { transaction });

        // Cập nhật tồn kho
        await this.updateBalance(ProductID, Quantity, transaction);
        results.push(inventoryTransaction);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = InventoryService;