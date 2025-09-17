const mongoose = require('mongoose');

const stockCheckSchema = new mongoose.Schema({
  checkId: {
    type: String,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  systemQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  actualQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  difference: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate checkId and calculate difference before saving
stockCheckSchema.pre('save', async function(next) {
  // Generate checkId
  if (!this.checkId) {
    try {
      const count = await this.constructor.countDocuments();
      this.checkId = `SC${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating checkId:', error);
      this.checkId = `SC${Date.now()}`; // Fallback
    }
  }
  
  // Calculate difference
  this.difference = this.actualQuantity - this.systemQuantity;
  
  next();
});

module.exports = mongoose.model('StockCheck', stockCheckSchema);