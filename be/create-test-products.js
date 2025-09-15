const { Product, InventoryBalance } = require('./models');
const { sequelize } = require('./config/database-sqlite');

async function createTestProducts() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const products = [
      { SKU: 'BQ001', Name: 'Bánh quy Oreo', Unit: 'Hộp', Location: 'A1-01', CostPrice: 15000, SalePrice: 20000 },
      { SKU: 'BQ002', Name: 'Bánh quy Cosy', Unit: 'Gói', Location: 'A1-02', CostPrice: 8000, SalePrice: 12000 },
      { SKU: 'KT001', Name: 'Kẹo toffee', Unit: 'Túi', Location: 'A2-01', CostPrice: 25000, SalePrice: 35000 },
      { SKU: 'ST001', Name: 'Sữa tươi TH', Unit: 'Hộp', Location: 'B1-01', CostPrice: 12000, SalePrice: 15000 },
      { SKU: 'ST002', Name: 'Sữa chua Vinamilk', Unit: 'Lốc', Location: 'B1-02', CostPrice: 45000, SalePrice: 55000 }
    ];

    for (const productData of products) {
      const [product, created] = await Product.findOrCreate({
        where: { SKU: productData.SKU },
        defaults: { ...productData, IsActive: true }
      });
      
      if (created) {
        console.log(`Created product: ${product.Name}`);
        
        // Tạo inventory balance
        await InventoryBalance.create({
          ProductID: product.ProductID,
          Quantity: Math.floor(Math.random() * 100) + 10
        });
      } else {
        console.log(`Product already exists: ${product.Name}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTestProducts();