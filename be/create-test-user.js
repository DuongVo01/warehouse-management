const bcrypt = require('bcryptjs');
const { User } = require('./models');
const { sequelize } = require('./config/database-sqlite');

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Kiểm tra xem đã có user chưa
    const existingUser = await User.findOne({ where: { Username: 'admin' } });
    if (existingUser) {
      console.log('User admin already exists with UserID:', existingUser.UserID);
      return;
    }

    // Tạo user mới
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      Username: 'admin',
      PasswordHash: hashedPassword,
      FullName: 'Administrator',
      Role: 'Admin',
      Email: 'admin@warehouse.com',
      Phone: '0123456789',
      IsActive: true
    });

    console.log('Created test user:', {
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTestUser();