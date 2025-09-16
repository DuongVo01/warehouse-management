const StockCheck = require('../models/StockCheck');
const InventoryBalance = require('../models/InventoryBalance');
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const mongoose = require('mongoose');

class StockCheckService {
  // Tạo phiếu kiểm kê tự động cho tất cả sản phẩm
  static async createFullStockCheck(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const balances = await InventoryBalance.find()
        .populate('productId', 'sku name unit isActive')
        .session(session);

      const stockChecks = [];
      for (const balance of balances) {
        if (balance.productId?.isActive) {
          const stockCheck = new StockCheck({
            productId: balance.productId._id,
            systemQty: balance.quantity,
            actualQty: balance.quantity, // Mặc định bằng hệ thống
            difference: 0,
            createdBy: userId,
            status: 'Pending'
          });

          await stockCheck.save({ session });
          stockChecks.push(stockCheck);
        }
      }

      await session.commitTransaction();
      return stockChecks;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Cập nhật số lượng thực tế hàng loạt
  static async updateActualQuantities(updates, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const results = [];

      for (const update of updates) {
        const { stockCheckId, actualQty } = update;
        
        const stockCheck = await StockCheck.findById(stockCheckId).session(session);
        if (!stockCheck || stockCheck.status !== 'Pending') {
          continue;
        }

        const difference = actualQty - stockCheck.systemQty;
        stockCheck.actualQty = actualQty;
        stockCheck.difference = difference;
        
        await stockCheck.save({ session });
        results.push(stockCheck);
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

  // Duyệt phiếu kiểm kê và tạo giao dịch điều chỉnh
  static async approveStockCheck(stockCheckId, approverId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const stockCheck = await StockCheck.findById(stockCheckId).session(session);
      if (!stockCheck || stockCheck.status !== 'Pending') {
        throw new Error('Phiếu kiểm kê không hợp lệ hoặc đã được xử lý');
      }

      // Cập nhật trạng thái phiếu kiểm kê
      stockCheck.status = 'Approved';
      stockCheck.approvedBy = approverId;
      await stockCheck.save({ session });

      // Nếu có chênh lệch, tạo giao dịch điều chỉnh và cập nhật tồn kho
      if (stockCheck.difference !== 0) {
        // Tạo giao dịch điều chỉnh
        const transaction = new InventoryTransaction({
          productId: stockCheck.productId,
          transactionType: stockCheck.difference > 0 ? 'Import' : 'Export',
          quantity: Math.abs(stockCheck.difference),
          note: `Điều chỉnh từ kiểm kê #${stockCheck._id}`,
          createdBy: approverId
        });

        await transaction.save({ session });

        // Cập nhật tồn kho
        const balance = await InventoryBalance.findOne({ productId: stockCheck.productId }).session(session);
        if (balance) {
          balance.quantity = stockCheck.actualQty;
          balance.lastUpdated = new Date();
          await balance.save({ session });
        } else {
          await InventoryBalance.create([{
            productId: stockCheck.productId,
            quantity: stockCheck.actualQty,
            lastUpdated: new Date()
          }], { session });
        }
      }

      await session.commitTransaction();
      return stockCheck;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Từ chối phiếu kiểm kê
  static async rejectStockCheck(stockCheckId, approverId, reason) {
    const stockCheck = await StockCheck.findById(stockCheckId);
    if (!stockCheck || stockCheck.status !== 'Pending') {
      throw new Error('Phiếu kiểm kê không hợp lệ hoặc đã được xử lý');
    }

    stockCheck.status = 'Rejected';
    stockCheck.approvedBy = approverId;
    stockCheck.note = reason;
    await stockCheck.save();

    return stockCheck;
  }

  // Thống kê kiểm kê
  static async getStockCheckStats(startDate, endDate) {
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [total, pending, approved, rejected] = await Promise.all([
      StockCheck.countDocuments(filter),
      StockCheck.countDocuments({ ...filter, status: 'Pending' }),
      StockCheck.countDocuments({ ...filter, status: 'Approved' }),
      StockCheck.countDocuments({ ...filter, status: 'Rejected' })
    ]);

    // Tính tổng chênh lệch
    const approvedChecks = await StockCheck.find({ ...filter, status: 'Approved' }, 'difference');
    const totalDifference = approvedChecks.reduce((sum, check) => sum + Math.abs(check.difference), 0);

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
    return await StockCheck.find({
      status: 'Approved',
      $or: [
        { difference: { $gte: threshold } },
        { difference: { $lte: -threshold } }
      ]
    })
    .populate('productId', 'sku name unit')
    .sort({ difference: -1 });
  }
}

module.exports = StockCheckService;