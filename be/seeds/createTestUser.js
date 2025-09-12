const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sequelize } = require('../config/database');

async function createTestUsers() {
  try {
    await sequelize.sync();

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo tài khoản Admin
    const admin = await User.findOrCreate({
      where: { Username: 'admin' },
      defaults: {
        Username: 'admin',
        PasswordHash: hashedPassword,
        FullName: 'Quản trị viên',
        Role: 'Admin',
        Email: 'admin@warehouse.com',
        Phone: '0123456789',
        IsActive: true
      }
    });

    // Tạo tài khoản Nhân viên kho
    const staff = await User.findOrCreate({
      where: { Username: 'staff' },
      defaults: {
        Username: 'staff',
        PasswordHash: hashedPassword,
        FullName: 'Nhân viên kho',
        Role: 'Staff',
        Email: 'staff@warehouse.com',
        Phone: '0987654321',
        IsActive: true
      }
    });

    // Tạo tài khoản Kế toán
    const accountant = await User.findOrCreate({
      where: { Username: 'accountant' },
      defaults: {
        Username: 'accountant',
        PasswordHash: hashedPassword,
        FullName: 'Kế toán',
        Role: 'Accountant',
        Email: 'accountant@warehouse.com',
        Phone: '0111222333',
        IsActive: true
      }
    });

    console.log('✅ Tạo tài khoản test thành công!');
    console.log('\n📋 Danh sách tài khoản:');
    console.log('1. Admin:');
    console.log('   - Username: admin');
    console.log('   - Password: 123456');
    console.log('   - Role: Admin');
    
    console.log('\n2. Nhân viên kho:');
    console.log('   - Username: staff');
    console.log('   - Password: 123456');
    console.log('   - Role: Staff');
    
    console.log('\n3. Kế toán:');
    console.log('   - Username: accountant');
    console.log('   - Password: 123456');
    console.log('   - Role: Accountant');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo tài khoản:', error);
    process.exit(1);
  }
}

createTestUsers();