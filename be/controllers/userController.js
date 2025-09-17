const User = require('../models/User');
const bcrypt = require('bcrypt');

// Tạo user mới
const createUser = async (req, res) => {
  try {
    const { username, password, fullName, role, email, phone, isActive } = req.body;
    
    if (!username || !password || !fullName || !role || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc' 
      });
    }

    // Tạo mã nhân viên
    const userCount = await User.countDocuments();
    const employeeCode = `NV${String(userCount + 1).padStart(4, '0')}`;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      employeeCode,
      passwordHash,
      fullName,
      role,
      email,
      phone,
      isActive: isActive !== undefined ? isActive : true
    });

    await user.save();

    const { passwordHash: _, ...userData } = user.toObject();
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username hoặc Email đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật user
const updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const { passwordHash: _, ...userData } = user.toObject();
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.json({ success: true, message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy user theo ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { passwordHash: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật profile cá nhân
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id.toString();
    
    // Chỉ cho phép user cập nhật profile của chính mình hoặc Admin
    if (userId !== currentUserId && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Không có quyền cập nhật thông tin này' 
      });
    }

    const updateData = { ...req.body };
    
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const { passwordHash: _, ...userData } = user.toObject();
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateProfile
};