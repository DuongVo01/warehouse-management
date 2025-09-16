const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const supplierRoutes = require('./supplierRoutes');
const productRoutes = require('./productRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const stockCheckRoutes = require('./stockCheckRoutes');
const reportRoutes = require('./reportRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/stock-checks', stockCheckRoutes);
router.use('/reports', reportRoutes);

module.exports = router;