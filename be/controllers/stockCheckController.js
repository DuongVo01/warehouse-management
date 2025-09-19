const StockCheck = require('../models/StockCheck');
const InventoryBalance = require('../models/InventoryBalance');

// Tạo kiểm kê mới
const createStockCheck = async (req, res) => {
  try {
    const { productId, actualQty } = req.body;
    
    if (!productId || actualQty === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    // Lấy số lượng hệ thống
    const balance = await InventoryBalance.findOne({ productId });
    const systemQty = balance ? balance.quantity : 0;
    const difference = actualQty - systemQty;

    const stockCheck = new StockCheck({
      productId,
      systemQty,
      actualQty,
      difference,
      createdBy: req.user._id
    });

    await stockCheck.save();
    
    const populatedStockCheck = await StockCheck.findById(stockCheck._id)
      .populate('productId')
      .populate('createdBy', 'fullName employeeCode');

    res.status(201).json({ success: true, data: populatedStockCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách kiểm kê
const getAllStockChecks = async (req, res) => {
  try {
    const stockChecks = await StockCheck.find()
      .populate('productId')
      .populate('createdBy', 'fullName employeeCode')
      .populate('approvedBy', 'fullName employeeCode')
      .sort({ createdAt: -1 });


    res.json({ success: true, data: stockChecks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Phê duyệt kiểm kê
const approveStockCheck = async (req, res) => {
  try {
    const stockCheck = await StockCheck.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        approvedBy: req.user._id
      },
      { new: true }
    ).populate('productId');

    if (!stockCheck) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu kiểm kê' });
    }

    // Cập nhật tồn kho nếu có chênh lệch
    if (stockCheck.difference !== 0) {
      await InventoryBalance.findOneAndUpdate(
        { productId: stockCheck.productId },
        { 
          quantity: stockCheck.actualQty,
          lastUpdated: new Date()
        },
        { upsert: true }
      );
    }

    res.json({ success: true, data: stockCheck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStockCheck,
  getAllStockChecks,
  approveStockCheck
};