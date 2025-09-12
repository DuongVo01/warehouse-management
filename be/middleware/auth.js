const jwt = require('jsonwebtoken');
const { User } = require('../models');
const envConfig = require('../config/env');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token không được cung cấp' });
    }

    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    const user = await User.findByPk(decoded.UserID, {
      attributes: { exclude: ['PasswordHash'] }
    });

    if (!user || !user.IsActive) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

module.exports = auth;