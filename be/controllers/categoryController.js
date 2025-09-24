const Category = require('../models/Category');

// Lấy danh sách categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo category mới
const createCategory = async (req, res) => {
  try {
    const { name, description, status = 'active' } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên danh mục là bắt buộc' 
      });
    }

    const category = new Category({ name, description, status });
    await category.save();
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên danh mục đã tồn tại' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy danh mục' 
      });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên danh mục đã tồn tại' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy danh mục' 
      });
    }
    
    res.json({ success: true, message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};