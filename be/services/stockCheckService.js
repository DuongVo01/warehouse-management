const { StockCheck, InventoryBalance, Product, InventoryTransaction } = require('../models');
const { sequelize } = require('../config/database-sqlite');

class StockCheckService {
  // Tạo phiếu kiểm kê tự động cho tất cả sản phẩm
  static async createFullStockCheck(userId) {
    const transaction = await sequelize.transaction();
    try {
      const balances = await InventoryBalance.findAll({
        include: [{ model: Product, where: { IsActive: true } }],
        transaction
      });

      const stockChecks = [];
      for (const balance of balances) {
        const stockCheck = await StockCheck.create({
          ProductID: balance.ProductID,
          SystemQty: balance.Quantity,
          ActualQty: balance.Quantity, // Mặc định bằng hệ thống, cần cập nhật thực tế
          Difference: 0,
          CreatedBy: userId,
          Status: 'Pending'
        }, { transaction });

        stockChecks.push(stockCheck);
      }

      await transaction.commit();
      return stockChecks;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Cập nhật số lượng thực tế hàng loạt
  static async updateActualQuantities(updates, userId) {
    const transaction = await sequelize.transaction();
    try {
      const results = [];

      for (const update of updates) {
        const { StockCheckID, ActualQty } = update;
        
        const stockCheck = await StockCheck.findByPk(StockCheckID, { transaction });
        if (!stockCheck || stockCheck.Status !== 'Pending') {
          continue;
        }

        const difference = ActualQty - stockCheck.SystemQty;
        await stockCheck.update({
          ActualQty,
          Difference: difference
        }, { transaction });

        results.push(stockCheck);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Duyệt phiếu kiểm kê và tạo giao dịch điều chỉnh
  static async approveStockCheck(stockCheckId, approverId) {
    const transaction = await sequelize.transaction();
    try {
      const stockCheck = await StockCheck.findByPk(stockCheckId, { transaction });
      if (!stockCheck || stockCheck.Status !== 'Pending') {
        throw new Error('Phiếu kiểm kê không hợp lệ hoặc đã được xử lý');
      }

      // Cập nhật trạng thái phiếu kiểm kê
      await stockCheck.update({
        Status: 'Approved',
        ApprovedBy: approverId
      }, { transaction });

      // Nếu có chênh lệch, tạo giao dịch điều chỉnh và cập nhật tồn kho
      if (stockCheck.Difference !== 0) {
        // Tạo giao dịch điều chỉnh
        await InventoryTransaction.create({
          ProductID: stockCheck.ProductID,
          TransactionType: 'Adjust',
          Quantity: stockCheck.Difference,
          Note: `Điều chỉnh từ kiểm kê #${stockCheck.StockCheckID}`,
          CreatedBy: approverId
        }, { transaction });

        // Cập nhật tồn kho
        const [balance] = await InventoryBalance.findOrCreate({
          where: { ProductID: stockCheck.ProductID },
          defaults: { Quantity: 0 },
          transaction
        });

        await balance.update({
          Quantity: stockCheck.ActualQty,
          LastUpdated: new Date()
        }, { transaction });
      }

      await transaction.commit();
      return stockCheck;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Từ chối phiếu kiểm kê
  static async rejectStockCheck(stockCheckId, approverId, reason) {
    const stockCheck = await StockCheck.findByPk(stockCheckId);
    if (!stockCheck || stockCheck.Status !== 'Pending') {
      throw new Error('Phiếu kiểm kê không hợp lệ hoặc đã được xử lý');
    }

    await stockCheck.update({
      Status: 'Rejected',
      ApprovedBy: approverId,
      Note: reason
    });

    return stockCheck;
  }

  // Thống kê kiểm kê
  static async getStockCheckStats(startDate, endDate) {
    const where = {};
    if (startDate && endDate) {
      where.CreatedAt = {
        [sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const [total, pending, approved, rejected] = await Promise.all([
      StockCheck.count({ where }),
      StockCheck.count({ where: { ...where, Status: 'Pending' } }),
      StockCheck.count({ where: { ...where, Status: 'Approved' } }),
      StockCheck.count({ where: { ...where, Status: 'Rejected' } })
    ]);

    // Tính tổng chênh lệch
    const approvedChecks = await StockCheck.findAll({
      where: { ...where, Status: 'Approved' },
      attributes: ['Difference']
    });

    const totalDifference = approvedChecks.reduce((sum, check) => sum + Math.abs(check.Difference), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      totalDifference
    };
  }

  // Lấy danh sách sản phẩm có chênh lệch lớn
  static async getHighVarianceProducts(threshold = 10) {
    return await StockCheck.findAll({
      where: {
        Status: 'Approved',
        [sequelize.Op.or]: [
          { Difference: { [sequelize.Op.gte]: threshold } },
          { Difference: { [sequelize.Op.lte]: -threshold } }
        ]
      },
      include: [{
        model: Product,
        attributes: ['SKU', 'Name', 'Unit']
      }],
      order: [['Difference', 'DESC']]
    });
  }
}

module.exports = StockCheckService;