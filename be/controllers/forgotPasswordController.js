const User = require('../models/User');
const crypto = require('crypto');
const emailService = require('../services/simpleEmailService');

// Tạo token reset password
const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request:', req.body);
    const { emailOrUsername } = req.body;
    
    if (!emailOrUsername) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email hoặc tên đăng nhập'
      });
    }

    // Tìm user theo email hoặc username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với thông tin này'
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 phút

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Tạo reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Gửi email thực tế
    console.log('Sending email to:', user.email);
    const emailResult = await emailService.sendResetPasswordEmail(
      user.email,
      resetLink,
      user.fullName
    );
    console.log('Email result:', emailResult);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email. Vui lòng thử lại sau.'
      });
    }

    res.json({
      success: true,
      message: `Link đặt lại mật khẩu đã được gửi đến email ${user.email}`,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Xác thực token reset
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    res.json({
      success: true,
      message: 'Token hợp lệ',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reset password với token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword
};