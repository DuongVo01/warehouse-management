class DateHelper {
  // Format ngày theo định dạng Việt Nam
  static formatVietnameseDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }

  // Format ngày giờ đầy đủ
  static formatDateTime(date) {
    if (!date) return '';
    return new Date(date).toLocaleString('vi-VN');
  }

  // Lấy ngày đầu tháng
  static getStartOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  // Lấy ngày cuối tháng
  static getEndOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  // Lấy ngày đầu tuần
  static getStartOfWeek(date = new Date()) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Thứ 2 là ngày đầu tuần
    return new Date(date.setDate(diff));
  }

  // Thêm ngày
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Tính số ngày giữa 2 ngày
  static daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  }

  // Kiểm tra ngày có hợp lệ không
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  // Chuyển string thành Date
  static parseDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return this.isValidDate(date) ? date : null;
  }

  // Lấy timestamp hiện tại
  static now() {
    return new Date();
  }

  // Format cho database (UTC)
  static toUTC(date) {
    return new Date(date).toISOString();
  }
}

module.exports = DateHelper;