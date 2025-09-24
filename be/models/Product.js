const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0
  },
  manufacturingDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Tự động tạo SKU dựa trên category
productSchema.pre('save', async function(next) {
  if (!this.sku && this.categoryId) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.categoryId);
      
      if (category) {
        // Đếm số sản phẩm trong danh mục này
        const count = await this.constructor.countDocuments({ categoryId: this.categoryId });
        // Tạo SKU: CategoryCode + số thứ tự (VD: CAT0001-001, CAT0001-002)
        const categoryCode = category.code || 'PRD';
        this.sku = `${categoryCode}-${String(count + 1).padStart(3, '0')}`;
      }
    } catch (error) {
      console.error('Error generating SKU:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);