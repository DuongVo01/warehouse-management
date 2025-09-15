const { Product } = require('../models');
const { Op } = require('sequelize');

// UC01 - Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const { sku, name, unit, costPrice, salePrice, expiryDate, location, isActive } = req.body;
    
    const productData = {
      SKU: sku,
      Name: name,
      Unit: unit,
      CostPrice: costPrice,
      SalePrice: salePrice,
      ExpiryDate: expiryDate,
      Location: location,
      IsActive: isActive !== undefined ? isActive : true
    };
    
    const product = await Product.create(productData);
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
    const { sku, name, unit, search, page = 1, limit = 10 } = req.query;
    console.log('Search params:', { sku, name, unit, search });
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { SKU: { [Op.like]: `%${search}%` } },
        { Name: { [Op.like]: `%${search}%` } }
      ];
    } else {
      if (sku) where.SKU = { [Op.like]: `%${sku}%` };
      if (name) where.Name = { [Op.like]: `%${name}%` };
      if (unit) where.Unit = { [Op.like]: `%${unit}%` };
    }

    console.log('Where clause:', where);

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    console.log('Found products:', products.count);

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
    console.error('Search error:', error);
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