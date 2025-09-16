const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'EmployeeCode', {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    });

    // Tạo mã nhân viên cho các user hiện có
    const users = await queryInterface.sequelize.query(
      'SELECT UserID FROM users ORDER BY UserID',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (let i = 0; i < users.length; i++) {
      const employeeCode = `NV${String(i + 1).padStart(4, '0')}`;
      await queryInterface.sequelize.query(
        'UPDATE users SET EmployeeCode = ? WHERE UserID = ?',
        { replacements: [employeeCode, users[i].UserID] }
      );
    }

    // Sau khi cập nhật xong thì set NOT NULL
    await queryInterface.changeColumn('users', 'EmployeeCode', {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'EmployeeCode');
  }
};