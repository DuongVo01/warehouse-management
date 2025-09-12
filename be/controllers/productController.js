const { Product } = require('../models');
const { Op } = require('sequelize');

// UC01 - Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'SKU đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC01 - Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { ProductID: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    const product = await Product.findByPk(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC01 - Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { ProductID: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC01 - Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC01 - Tra cứu sản phẩm
const searchProducts = async (req, res) => {
  try {
    const { sku, name, unit, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (sku) where.SKU = { [Op.iLike]: `%${sku}%` };
    if (name) where.Name = { [Op.iLike]: `%${name}%` };
    if (unit) where.Unit = { [Op.iLike]: `%${unit}%` };

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: products.rows,
      pagination: {
        total: products.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(products.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  searchProducts,
};