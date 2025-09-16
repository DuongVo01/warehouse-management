const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Import', 'Export']
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    min: 0
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  customerInfo: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);