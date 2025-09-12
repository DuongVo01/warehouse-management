const { Supplier } = require('../models');
const { Op } = require('sequelize');

// Tạo nhà cung cấp mới
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật nhà cung cấp
const updateSupplier = async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { SupplierID: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    const supplier = await Supplier.findByPk(req.params.id);
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa nhà cung cấp
const deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.destroy({
      where: { SupplierID: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, message: 'Xóa nhà cung cấp thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết nhà cung cấp
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách nhà cung cấp
const getAllSuppliers = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (name) where.Name = { [Op.iLike]: `%${name}%` };

    const suppliers = await Supplier.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: suppliers.rows,
      pagination: {
        total: suppliers.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(suppliers.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
};