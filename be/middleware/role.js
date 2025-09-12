const role = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa xác thực' });
    }

    if (!allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Không có quyền truy cập chức năng này' 
      });
    }

    next();
  };
};

module.exports = role;