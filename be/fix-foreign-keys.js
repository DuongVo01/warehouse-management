const { sequelize } = require('./config/database-sqlite');

async function fixForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Tắt foreign key constraints tạm thời
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Xóa và tạo lại bảng inventory_transactions
    await sequelize.query('DROP TABLE IF EXISTS inventory_transactions');
    
    await sequelize.query(`
      CREATE TABLE inventory_transactions (
        transaction_i_d INTEGER PRIMARY KEY AUTOINCREMENT,
        product_i_d INTEGER NOT NULL,
        transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Import', 'Export', 'Adjust')),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(18,2),
        supplier_i_d INTEGER,
        customer_info TEXT,
        note TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_i_d) REFERENCES products(product_i_d),
        FOREIGN KEY (supplier_i_d) REFERENCES suppliers(supplier_i_d),
        FOREIGN KEY (created_by) REFERENCES users(user_i_d)
      )
    `);

    // Bật lại foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('Fixed foreign key constraints');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixForeignKeys();