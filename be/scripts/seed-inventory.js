const { InventoryBalance, Product } = require('../models');
const { sequelize } = require('../config/database-sqlite');

const seedInventoryData = async () => {
  try {
    console.log('Seeding inventory data...');

    // Kiểm tra sản phẩm có sẵn
    const products = await Product.findAll();
    console.log('Available products:', products.map(p => ({ id: p.ProductID, name: p.Name })));

    if (products.length === 0) {
      console.log('No products found. Please create products first.');
      return;
    }

    // Tạo dữ liệu tồn kho cho các sản phẩm có sẵn
    for (const product of products) {
      const quantity = Math.floor(Math.random() * 100) + 10; // Random 10-109
      
      await InventoryBalance.upsert({
        ProductID: product.ProductID,
        Quantity: quantity,
        LastUpdated: new Date()
      });
      
      console.log(`Created inventory balance for ${product.Name}: ${quantity}`);
    }

    console.log('Inventory data seeded successfully!');
  } catch (error) {
    console.error('Error seeding inventory data:', error);
  }
};

// Chạy script
seedInventoryData();