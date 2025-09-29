class MockEmailService {
  async sendResetPasswordEmail(email, resetLink, userName) {
    try {
      console.log('=== MOCK EMAIL SERVICE ===');
      console.log('To:', email);
      console.log('User:', userName);
      console.log('Reset Link:', resetLink);
      console.log('========================');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        messageId: 'mock-' + Date.now(),
        message: 'Email sent successfully (mock)'
      };
    } catch (error) {
      console.error('Mock email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MockEmailService();