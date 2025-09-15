const { sequelize } = require('./config/database-sqlite');

async function createAllTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Tạo bảng inventory_transactions
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
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
    console.log('Created inventory_transactions table');

    // Tạo bảng inventory_balance
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS inventory_balance (
        balance_i_d INTEGER PRIMARY KEY AUTOINCREMENT,
        product_i_d INTEGER NOT NULL UNIQUE,
        quantity INTEGER NOT NULL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_i_d) REFERENCES products(product_i_d)
      )
    `);
    console.log('Created inventory_balance table');

    // Kiểm tra lại các bảng
    const [results] = await sequelize.query('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('\nAll tables:');
    results.forEach(row => console.log('- ' + row.name));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createAllTables();