const logger = require('../config/logger');

class EmailService {
  // Gửi cảnh báo tồn kho thấp
  static async sendLowStockAlert(products, recipients) {
    try {
      // Giả lập gửi email (trong thực tế sẽ dùng nodemailer hoặc service khác)
      const emailContent = {
        subject: 'Cảnh báo: Hàng tồn kho thấp',
        body: `
          Các sản phẩm sau đây có tồn kho thấp:
          ${products.map(p => `- ${p.Product?.Name}: ${p.Quantity} ${p.Product?.Unit}`).join('\n')}
          
          Vui lòng kiểm tra và bổ sung hàng hóa.
        `,
        recipients
      };

      logger.info('Low stock alert email sent', emailContent);
      return { success: true, message: 'Email cảnh báo đã được gửi' };
    } catch (error) {
      logger.error('Failed to send low stock alert', error);
      throw error;
    }
  }

  // Gửi thông báo hàng sắp hết hạn
  static async sendExpiryAlert(products, recipients) {
    try {
      const emailContent = {
        subject: 'Cảnh báo: Hàng sắp hết hạn sử dụng',
        body: `
          Các sản phẩm sau đây sắp hết hạn sử dụng:
          ${products.map(p => `- ${p.Name}: HSD ${p.ExpiryDate?.toLocaleDateString('vi-VN')}`).join('\n')}
          
          Vui lòng xử lý trước khi hết hạn.
        `,
        recipients
      };

      logger.info('Expiry alert email sent', emailContent);
      return { success: true, message: 'Email cảnh báo hết hạn đã được gửi' };
    } catch (error) {
      logger.error('Failed to send expiry alert', error);
      throw error;
    }
  }

  // Gửi báo cáo định kỳ
  static async sendPeriodicReport(reportData, recipients) {
    try {
      const emailContent = {
        subject: 'Báo cáo kho hàng định kỳ',
        body: `
          Báo cáo tình hình kho hàng:
          - Tổng số giao dịch nhập: ${reportData.import?.count || 0}
          - Tổng số giao dịch xuất: ${reportData.export?.count || 0}
          - Giá trị tồn kho hiện tại: ${reportData.inventoryValue?.toLocaleString('vi-VN')} VNĐ
          
          Chi tiết trong file đính kèm.
        `,
        recipients,
        attachments: reportData.filePath ? [reportData.filePath] : []
      };

      logger.info('Periodic report email sent', emailContent);
      return { success: true, message: 'Báo cáo định kỳ đã được gửi' };
    } catch (error) {
      logger.error('Failed to send periodic report', error);
      throw error;
    }
  }

  // Gửi thông báo kiểm kê
  static async sendStockCheckNotification(stockCheck, recipients) {
    try {
      const emailContent = {
        subject: 'Thông báo: Phiếu kiểm kê cần duyệt',
        body: `
          Phiếu kiểm kê #${stockCheck.StockCheckID} cần được duyệt:
          - Sản phẩm: ${stockCheck.Product?.Name}
          - Số lượng hệ thống: ${stockCheck.SystemQty}
          - Số lượng thực tế: ${stockCheck.ActualQty}
          - Chênh lệch: ${stockCheck.Difference}
          
          Vui lòng vào hệ thống để xử lý.
        `,
        recipients
      };

      logger.info('Stock check notification sent', emailContent);
      return { success: true, message: 'Thông báo kiểm kê đã được gửi' };
    } catch (error) {
      logger.error('Failed to send stock check notification', error);
      throw error;
    }
  }

  // Gửi thông báo giao dịch lớn
  static async sendLargeTransactionAlert(transaction, recipients) {
    try {
      const emailContent = {
        subject: 'Cảnh báo: Giao dịch có giá trị lớn',
        body: `
          Giao dịch #${transaction.TransactionID} có giá trị lớn:
          - Loại: ${transaction.TransactionType}
          - Sản phẩm: ${transaction.Product?.Name}
          - Số lượng: ${Math.abs(transaction.Quantity)}
          - Giá trị: ${(Math.abs(transaction.Quantity) * (transaction.UnitPrice || 0)).toLocaleString('vi-VN')} VNĐ
          
          Vui lòng kiểm tra và xác nhận.
        `,
        recipients
      };

      logger.info('Large transaction alert sent', emailContent);
      return { success: true, message: 'Cảnh báo giao dịch lớn đã được gửi' };
    } catch (error) {
      logger.error('Failed to send large transaction alert', error);
      throw error;
    }
  }
}

module.exports = EmailService;