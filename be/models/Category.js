const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Tự động tạo mã danh mục trước khi save
categorySchema.pre('save', async function(next) {
  if (!this.code) {
    const count = await this.constructor.countDocuments();
    this.code = `CAT${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);