const nodemailer = require('nodemailer');

// Try to import googleapis, fallback if not available
let google;
try {
  google = require('googleapis');
} catch (error) {
  console.log('googleapis not installed, using SMTP only');
}

class EmailService {
  constructor() {
    // Try OAuth2.0 first, fallback to SMTP if needed
    this.useOAuth = google && process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN;
    
    if (this.useOAuth) {
      try {
        this.oauth2Client = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );

        this.oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });
      } catch (error) {
        console.error('OAuth2 setup failed:', error.message);
        this.useOAuth = false;
      }
    }
  }

  // Fallback SMTP transporter
  createSMTPTransporter() {
    console.log('Creating SMTP transporter with:');
    console.log('User:', process.env.EMAIL_USER);
    console.log('Pass length:', process.env.EMAIL_PASS?.length);
    console.log('Pass exists:', !!process.env.EMAIL_PASS);
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password fallback
      }
    });
  }

  async createTransporter() {
    try {
      console.log('Creating OAuth2 transporter...');
      console.log('Email user:', process.env.EMAIL_USER);
      console.log('Client ID:', process.env.GMAIL_CLIENT_ID?.substring(0, 20) + '...');
      
      const accessToken = await this.oauth2Client.getAccessToken();
      console.log('Access token obtained successfully');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken.token
        }
      });
      
      console.log('Transporter created successfully');
      return transporter;
    } catch (error) {
      console.error('Error creating transporter:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email, resetLink, userName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
      console.log('Attempting to send email to:', email);
      
      let transporter;
      if (this.useOAuth) {
        console.log('Using OAuth2.0 method...');
        transporter = await this.createTransporter();
      } else {
        console.log('Using SMTP fallback method...');
        transporter = this.createSMTPTransporter();
      }
      
      console.log('Testing transporter connection...');
      await transporter.verify();
      console.log('Transporter verified successfully');
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error.message);
      
      // Try fallback if OAuth2.0 fails and EMAIL_PASS exists
      if (this.useOAuth && process.env.EMAIL_PASS) {
        console.log('OAuth2.0 failed, trying SMTP fallback...');
        try {
          const smtpTransporter = this.createSMTPTransporter();
          const info = await smtpTransporter.sendMail(mailOptions);
          console.log('Email sent via SMTP fallback:', info.messageId);
          return { success: true, messageId: info.messageId };
        } catch (smtpError) {
          console.error('SMTP fallback also failed:', smtpError.message);
        }
      } else if (!this.useOAuth) {
        console.log('OAuth2.0 not configured and no EMAIL_PASS, cannot send email');
      }
      
      return { success: false, error: error.message };
    }
  }

  // Test email connection
  async testConnection() {
    try {
      const transporter = await this.createTransporter();
      await transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();