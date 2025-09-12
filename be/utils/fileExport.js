const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class FileExporter {
  // Tạo file Excel
  static async createExcel(data, columns, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Thiết lập columns
    worksheet.columns = columns;

    // Thêm dữ liệu
    data.forEach(row => worksheet.addRow(row));

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width || 10, 15);
    });

    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  // Tạo file PDF
  static async createPDF(data, title, fileName) {
    const doc = new PDFDocument();
    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(16).text(title, { align: 'center' });
    doc.fontSize(10).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
    doc.moveDown();

    // Content
    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${JSON.stringify(item)}`);
    });

    doc.end();
    return filePath;
  }

  // Tạo CSV
  static async createCSV(data, fileName) {
    if (!data.length) return null;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const filePath = path.join(process.env.REPORT_EXPORT_PATH || './reports', fileName);
    fs.writeFileSync(filePath, csvContent, 'utf8');
    return filePath;
  }

  // Đảm bảo thư mục tồn tại
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Xóa file cũ
  static cleanupOldFiles(directory, maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = FileExporter;