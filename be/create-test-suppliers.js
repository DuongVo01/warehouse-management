const { Supplier } = require('./models');
const { sequelize } = require('./config/database-sqlite');

async function createTestSuppliers() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Tạo suppliers test
    const suppliers = [
      { Name: 'Nhà cung cấp A', ContactPerson: 'Nguyễn Văn A', Phone: '0123456789', Email: 'a@supplier.com' },
      { Name: 'Nhà cung cấp B', ContactPerson: 'Trần Thị B', Phone: '0987654321', Email: 'b@supplier.com' },
      { Name: 'Nhà cung cấp C', ContactPerson: 'Lê Văn C', Phone: '0111222333', Email: 'c@supplier.com' }
    ];

    for (const supplierData of suppliers) {
      const [supplier, created] = await Supplier.findOrCreate({
        where: { Name: supplierData.Name },
        defaults: supplierData
      });
      
      if (created) {
        console.log(`Created supplier: ${supplier.Name} with ID: ${supplier.SupplierID}`);
      } else {
        console.log(`Supplier already exists: ${supplier.Name} with ID: ${supplier.SupplierID}`);
      }
    }
  } catch (error) {
    console.error('Error creating suppliers:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTestSuppliers();