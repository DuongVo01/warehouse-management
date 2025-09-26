const nodemailer = require('nodemailer');

class SimpleEmailService {
  constructor() {
    console.log('Initializing SendGrid SMTP...');
    console.log('SMTP Host:', process.env.SMTP_HOST);
    console.log('SMTP Port:', process.env.SMTP_PORT);
    console.log('Email Sender:', process.env.EMAIL_SENDER);
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendResetPasswordEmail(email, resetLink, userName) {
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: 'Đặt lại mật khẩu - Hệ thống quản lý kho hàng',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Hệ thống quản lý kho hàng</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Xin chào ${userName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #1890ff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;
                        display: inline-block;">
                Đặt lại mật khẩu
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Hoặc copy link sau vào trình duyệt:
              <br>
              <a href="${resetLink}" style="color: #1890ff; word-break: break-all;">
                ${resetLink}
              </a>
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Lưu ý:</strong> Link này sẽ hết hạn sau 30 phút. 
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Trân trọng,<br>
              <strong>Đội ngũ hỗ trợ</strong>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            © 2024 Hệ thống quản lý kho hàng. Tất cả quyền được bảo lưu.
          </div>
        </div>
      `
    };

    try {
      console.log('Sending email to:', email);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SimpleEmailService();