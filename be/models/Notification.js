const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['stock', 'expiry', 'transaction', 'system', 'stockcheck', 'report'],
    required: true
  },
  targetRoles: [{
    type: String,
    enum: ['Admin', 'Staff', 'Accountant']
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index để tối ưu query
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ targetRoles: 1, category: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);