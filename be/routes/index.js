const express = require('express');
const router = express.Router();
const envConfig = require('../config/env');

// Nhập các route con
const authRoutes = require('./authRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const productRoutes = require('./productRoutes');
const reportRoutes = require('./reportRoutes');
const stockCheckRoutes = require('./stockCheckRoutes');
const supplierRoutes = require('./supplierRoutes');
const userRoutes = require('./userRoutes');

// Gắn các route con với prefix tương ứng
router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);
router.use('/reports', reportRoutes);
router.use('/stock-check', stockCheckRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);

// Route mặc định để kiểm tra API
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Warehouse Management API',
    version: '1.0.0',
    endpoints: [
      `${envConfig.API_PREFIX}/inventory`,
      `${envConfig.API_PREFIX}/products`,
      `${envConfig.API_PREFIX}/reports`,
      `${envConfig.API_PREFIX}/stock-check`,
      `${envConfig.API_PREFIX}/suppliers`,
      `${envConfig.API_PREFIX}/users`,
    ],
  });
});

module.exports = router;