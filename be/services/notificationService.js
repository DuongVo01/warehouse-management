const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Tạo thông báo mới
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Tạo thông báo cho nhiều user
  static async createBulkNotifications(notifications) {
    try {
      await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
    }
  }

  // Thông báo sản phẩm sắp hết hàng
  static async notifyLowStock(productId, quantity, productName, productSku) {
    const targetUsers = await User.find({ 
      role: { $in: ['Admin', 'Staff'] },
      isActive: { $ne: false }
    }).lean();
    
    const notifications = targetUsers.map(user => ({
      title: 'Cảnh báo tồn kho thấp',
      message: `Sản phẩm ${productSku} - ${productName} sắp hết hàng. Vui lòng nhập kho!`,
      type: 'warning',
      category: 'stock',
      userId: user._id,
      targetRoles: ['Admin', 'Staff'],
      data: { productId, quantity, productSku, productName }
    }));

    await this.createBulkNotifications(notifications);
  }

  // Thông báo sản phẩm sắp hết hạn
  static async notifyExpiring(productId, expiryDate, productName, productSku) {
    const targetUsers = await User.find({ 
      role: { $in: ['Admin', 'Staff'] },
      isActive: { $ne: false }
    }).lean();
    
    const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft <= 0;
    
    const notifications = targetUsers.map(user => ({
      title: isExpired ? 'Sản phẩm đã hết hạn' : 'Cảnh báo hết hạn',
      message: isExpired 
        ? `Sản phẩm ${productSku} - ${productName} đã hết hạn ${Math.abs(daysLeft)} ngày. Vui lòng xử lý!`
        : `Sản phẩm ${productSku} - ${productName} sẽ hết hạn sau ${daysLeft} ngày. Vui lòng xử lý!`,
      type: isExpired ? 'error' : 'warning',
      category: 'expiry',
      userId: user._id,
      targetRoles: ['Admin', 'Staff'],
      data: { productId, expiryDate, daysLeft, isExpired, productSku, productName }
    }));

    await this.createBulkNotifications(notifications);
  }

  // Thông báo giao dịch thành công
  static async notifyTransaction(userId, type, productName, quantity, userInfo = null) {
    // Thông báo cho người thực hiện
    await this.createNotification({
      title: `${type === 'Import' ? 'Nhập' : 'Xuất'} kho thành công`,
      message: `${type === 'Import' ? 'Nhập' : 'Xuất'} ${quantity} ${productName}`,
      type: 'success',
      category: 'transaction',
      userId,
      targetRoles: ['Admin', 'Staff', 'Accountant'],
      data: { type, productName, quantity }
    });
    
    // Thông báo cho Admin về hoạt động của nhân viên
    if (userInfo && userInfo.role !== 'Admin') {
      const adminUsers = await User.find({ role: 'Admin', isActive: { $ne: false } }).lean();
      
      const adminNotifications = adminUsers
        .filter(admin => admin._id.toString() !== userId.toString())
        .map(admin => ({
          title: `${type === 'Import' ? 'Phiếu nhập' : 'Phiếu xuất'} kho mới`,
          message: `Nhân viên ${userInfo.fullName} (${userInfo.employeeCode || 'N/A'}) vừa tạo một phiếu ${type === 'Import' ? 'nhập' : 'xuất'} kho mới cho sản phẩm ${productName}.`,
          type: 'info',
          category: 'transaction',
          userId: admin._id,
          targetRoles: ['Admin'],
          data: { 
            type, 
            productName, 
            quantity, 
            staffName: userInfo.fullName,
            staffCode: userInfo.employeeCode,
            createdBy: userId
          }
        }));
      
      if (adminNotifications.length > 0) {
        await this.createBulkNotifications(adminNotifications);
      }
    }
  }

  // Thông báo kiểm kê được duyệt
  static async notifyStockCheckApproved(stockCheckId, productName, createdBy) {
    await this.createNotification({
      title: 'Phiếu kiểm kê được duyệt',
      message: `Phiếu kiểm kê sản phẩm "${productName}" đã được duyệt`,
      type: 'success',
      category: 'stockcheck',
      userId: createdBy,
      targetRoles: ['Admin', 'Staff'],
      data: { stockCheckId, productName }
    });
  }

  // Thông báo tạo phiếu kiểm kê mới
  static async notifyStockCheckCreated(stockCheckId, productName, userInfo) {
    const adminUsers = await User.find({ 
      role: 'Admin', 
      isActive: { $ne: false } 
    }).lean();
    
    const notifications = adminUsers.map(admin => ({
      title: 'Phiếu kiểm kê mới',
      message: `Nhân viên ${userInfo.fullName} (${userInfo.employeeCode || 'N/A'}) vừa tạo một phiếu kiểm kê kho mới. Vui lòng kiểm tra và phê duyệt.`,
      type: 'warning',
      category: 'stockcheck',
      userId: admin._id,
      targetRoles: ['Admin'],
      data: { 
        stockCheckId, 
        productName,
        staffName: userInfo.fullName,
        staffCode: userInfo.employeeCode,
        createdBy: userInfo.userId
      }
    }));

    await this.createBulkNotifications(notifications);
  }

  // Thông báo báo cáo
  static async notifyReport(title, message, targetRoles = ['Admin', 'Accountant']) {
    const targetUsers = await User.find({ 
      role: { $in: targetRoles },
      isActive: { $ne: false }
    }).lean();
    
    const notifications = targetUsers.map(user => ({
      title,
      message,
      type: 'info',
      category: 'report',
      userId: user._id,
      targetRoles,
      data: {}
    }));

    await this.createBulkNotifications(notifications);
  }
}

module.exports = NotificationService;