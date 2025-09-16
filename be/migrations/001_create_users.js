const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Xóa bảng users nếu tồn tại
    await queryInterface.dropTable('users').catch(() => {});
    
    // Tạo lại bảng users với EmployeeCode
    await queryInterface.createTable('users', {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      EmployeeCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('Admin', 'Staff', 'Accountant'),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      Phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Tạo dữ liệu users mới
    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);
    const accountantPassword = await bcrypt.hash('accountant123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        Username: 'admin',
        EmployeeCode: 'NV0001',
        PasswordHash: adminPassword,
        FullName: 'Quản trị viên hệ thống',
        Role: 'Admin',
        Email: 'admin@warehouse.com',
        Phone: '0123456789',
        IsActive: true,
        CreatedAt: new Date(),
      },
      {
        Username: 'nhanvien_kho',
        EmployeeCode: 'NV0002',
        PasswordHash: staffPassword,
        FullName: 'Nguyễn Văn Kho',
        Role: 'Staff',
        Email: 'nhanvien@warehouse.com',
        Phone: '0987654321',
        IsActive: true,
        CreatedAt: new Date(),
      },
      {
        Username: 'ke_toan',
        EmployeeCode: 'NV0003',
        PasswordHash: accountantPassword,
        FullName: 'Trần Thị Toán',
        Role: 'Accountant',
        Email: 'ketoan@warehouse.com',
        Phone: '0369852147',
        IsActive: true,
        CreatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};