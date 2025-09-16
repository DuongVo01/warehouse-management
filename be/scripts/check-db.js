const mongoose = require('mongoose');

const checkDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/warehouse_management');
    console.log('✅ Kết nối MongoDB thành công');

    // Lấy danh sách collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Danh sách collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Kiểm tra số lượng documents
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Supplier = require('../models/Supplier');

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const supplierCount = await Supplier.countDocuments();

    console.log('\n📊 Số lượng documents:');
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Products: ${productCount}`);
    console.log(`  - Suppliers: ${supplierCount}`);

    // Hiển thị users
    const users = await User.find({}, { passwordHash: 0 });
    console.log('\n👤 Danh sách users:');
    users.forEach(user => {
      console.log(`  - ${user.employeeCode}: ${user.username} (${user.fullName}) - ${user.role}`);
    });

    console.log('\n✅ Kiểm tra hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

checkDatabase();