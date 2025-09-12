const { sequelize } = require('../config/database-sqlite');

const checkDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');

    // Lấy danh sách bảng
    const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n📋 Danh sách bảng:');
    results.forEach(table => console.log(`  - ${table.name}`));

    // Kiểm tra cấu trúc bảng users
    const [userSchema] = await sequelize.query("PRAGMA table_info(users)");
    console.log('\n👤 Cấu trúc bảng users:');
    userSchema.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

    // Kiểm tra cấu trúc bảng products
    const [productSchema] = await sequelize.query("PRAGMA table_info(products)");
    console.log('\n📦 Cấu trúc bảng products:');
    productSchema.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

    console.log('\n✅ Kiểm tra hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

checkDatabase();