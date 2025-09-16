const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// UC07 - Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { Username, Password, FullName, Role, Email, Phone, IsActive } = req.body;
    
    // Validation chi tiết
    const missingFields = [];
    if (!Username) missingFields.push('Username');
    if (!Password) missingFields.push('Password');
    if (!FullName) missingFields.push('FullName');
    if (!Role) missingFields.push('Role');
    if (!Email) missingFields.push('Email');
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        success: false, 
        message: `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}` 
      });
    }
    
    // Hash password
    const PasswordHash = await bcrypt.hash(Password, 10);
    
    const user = await User.create({
      Username,
      PasswordHash,
      FullName,
      Role,
      Email,
      Phone,
      IsActive: true
    });
    
    // Không trả về password hash
    const { PasswordHash: _, ...userData } = user.toJSON();
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Username hoặc Email đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC07 - Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Nếu có password mới thì hash nó
    if (updateData.Password) {
      updateData.PasswordHash = await bcrypt.hash(updateData.Password, 10);
      delete updateData.Password;
    }
    
    const [updated] = await User.update(updateData, {
      where: { UserID: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['PasswordHash'] }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UC07 - Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Không cho phép xóa Admin cuối cùng
    if (user.Role === 'Admin') {
      const adminCount = await User.count({ where: { Role: 'Admin', IsActive: true } });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Không thể xóa Admin cuối cùng' });
      }
    }

    await user.destroy();
    res.json({ success: true, message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết người dùng
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['PasswordHash'] }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Danh sách người dùng
const getAllUsers = async (req, res) => {
  try {
    const { Role, IsActive, search, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (Role) where.Role = Role;
    if (IsActive !== undefined) where.IsActive = IsActive === 'true';
    if (search) {
      where[Op.or] = [
        { Username: { [Op.iLike]: `%${search}%` } },
        { FullName: { [Op.iLike]: `%${search}%` } },
        { Email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['PasswordHash'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['CreatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái người dùng
const updateUserStatus = async (req, res) => {
  try {
    const { IsActive } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Không cho phép vô hiệu hóa Admin cuối cùng
    if (user.Role === 'Admin' && IsActive === false) {
      const activeAdminCount = await User.count({ 
        where: { Role: 'Admin', IsActive: true, UserID: { [Op.ne]: user.UserID } }
      });
      if (activeAdminCount === 0) {
        return res.status(400).json({ success: false, message: 'Không thể vô hiệu hóa Admin cuối cùng' });
      }
    }

    await user.update({ IsActive });
    const { PasswordHash, ...userData } = user.toJSON();
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUserStatus,
};