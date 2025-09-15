const { sequelize } = require('./config/database-sqlite');
const bcrypt = require('bcryptjs');

async function recreateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Tắt foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Xóa tất cả bảng
    const tables = ['inventory_transactions', 'inventory_balance', 'stock_checks', 'reports'];
    for (const table of tables) {
      await sequelize.query(`DROP TABLE IF EXISTS ${table}`);
    }
    
    // Sync lại models
    await sequelize.sync({ force: true });
    
    // Tạo user admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await sequelize.query(`
      INSERT INTO users (username, password_hash, full_name, role, email, phone, is_active, created_at)
      VALUES ('admin', ?, 'Administrator', 'Admin', 'admin@warehouse.com', '0123456789', 1, datetime('now'))
    `, { replacements: [hashedPassword] });
    
    // Tạo suppliers
    const suppliers = [
      ['Nhà cung cấp A', '0123456789', 'a@supplier.com'],
      ['Nhà cung cấp B', '0987654321', 'b@supplier.com'], 
      ['Nhà cung cấp C', '0111222333', 'c@supplier.com']
    ];
    
    for (const [name, phone, email] of suppliers) {
      await sequelize.query(`
        INSERT INTO suppliers (name, phone, email, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `, { replacements: [name, phone, email] });
    }
    
    // Bật lại foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('Database recreated successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

recreateDatabase();