const Supplier = require('../models/Supplier');

// Tạo supplier mới
const createSupplier = async (req, res) => {
  try {
    const { name, address, phone, email, taxCode } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên nhà cung cấp là bắt buộc' 
      });
    }

    // Tạo mã nhà cung cấp
    const supplierCount = await Supplier.countDocuments();
    const supplierCode = `SUP${String(supplierCount + 1).padStart(4, '0')}`;

    const supplier = new Supplier({
      supplierCode,
      name,
      address,
      phone,
      email,
      taxCode
    });

    await supplier.save();
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy suppliers đang hoạt động
const getActiveSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật supplier
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, message: 'Xóa nhà cung cấp thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getActiveSuppliers,
  updateSupplier,
  deleteSupplier
};