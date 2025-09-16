const Product = require('../models/Product');

// Tạo product mới
const createProduct = async (req, res) => {
  try {
    const { sku, name, unit, costPrice, salePrice, expiryDate, location } = req.body;
    
    if (!sku || !name || !unit || costPrice === undefined || salePrice === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    const product = new Product({
      sku,
      name,
      unit,
      costPrice,
      salePrice,
      expiryDate,
      location
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'SKU đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả products
const getAllProducts = async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    
    let filter = { isActive: { $ne: false } };
    
    // Thêm tìm kiếm nếu có
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};