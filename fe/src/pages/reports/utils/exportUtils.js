import { message } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Cấu hình font cho tiếng Việt
const configureVietnameseFont = (doc) => {
  // Sử dụng Times font hỗ trợ Unicode tốt hơn
  doc.setFont('times', 'normal');
};

export const exportToExcel = (reportData, reportType, reportTypes) => {
  if (reportData.length === 0) {
    message.warning('Không có dữ liệu để xuất');
    return;
  }

  const reportName = reportTypes.find(t => t.value === reportType)?.label || 'Báo cáo';
  let exportData = [];

  switch (reportType) {
    case 'inventory':
      exportData = reportData.map((item, index) => ({
        'STT': index + 1,
        'Mã SP': item.productId?.sku || '',
        'Tên sản phẩm': item.productId?.name || '',
        'Đơn vị': item.productId?.unit || '',
        'Tồn kho': item.quantity || 0,
        'Vị trí': item.productId?.location || '',
        'Ngày báo cáo': new Date().toLocaleDateString('vi-VN')
      }));
      break;
    case 'transactions':
      exportData = reportData.map((item, index) => {
        const id = item._id;
        const date = item.createdAt;
        const type = item.transactionType === 'Import' ? 'NK' : 'XK';
        
        let transactionCode = '-';
        if (id && date) {
          const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
          transactionCode = `${type}${dateStr}${String(id).slice(-4)}`;
        } else if (id) {
          transactionCode = `${type}${String(id).slice(-6)}`;
        }
        
        const price = item.transactionType === 'Import' 
          ? item.unitPrice 
          : item.productId?.salePrice;
        
        return {
          'STT': index + 1,
          'Mã GD': transactionCode,
          'Loại': item.transactionType === 'Import' ? 'Nhập' : 'Xuất',
          'Sản phẩm': `${item.productId?.sku} - ${item.productId?.name}` || '',
          'Số lượng': Math.abs(item.quantity || 0),
          'Đơn giá': price || 0,
          'Ngày': date ? new Date(date).toLocaleDateString('vi-VN') : '-',
          'Ghi chú': item.note || item.customerInfo || ''
        };
      });
      break;
    case 'lowstock':
      exportData = reportData.map((item, index) => ({
        'STT': index + 1,
        'Mã SP': item.productId?.sku || '',
        'Tên sản phẩm': item.productId?.name || '',
        'Tồn kho': item.quantity || 0,
        'Vị trí': item.productId?.location || ''
      }));
      break;
    case 'expiring':
      exportData = reportData.map((item, index) => ({
        'STT': index + 1,
        'Mã SP': item.productId?.sku || '',
        'Tên sản phẩm': item.productId?.name || '',
        'Tồn kho': item.quantity || 0,
        'Hạn sử dụng': item.productId?.expiryDate ? new Date(item.productId.expiryDate).toLocaleDateString('vi-VN') : ''
      }));
      break;
    default:
      exportData = reportData.map((item, index) => ({
        'STT': index + 1,
        'Mã SP': item.productId?.sku || '',
        'Tên sản phẩm': item.productId?.name || '',
        'Tồn kho': item.quantity || 0
      }));
  }

  const headers = Object.keys(exportData[0]);
  const csvContent = [
    headers.join(','),
    ...exportData.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${reportName}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  message.success(`Đã xuất ${reportData.length} bản ghi ra file Excel`);
};

export const exportToPDF = (reportData, reportType, reportTypes) => {
  if (reportData.length === 0) {
    message.warning('Không có dữ liệu để xuất');
    return;
  }

  const reportName = reportTypes.find(t => t.value === reportType)?.label || 'Báo cáo';
  const doc = new jsPDF();
  
  configureVietnameseFont(doc);
  
  // Tiêu đề báo cáo
  doc.setFontSize(16);
  doc.text('BAO CAO KHO HANG', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Ngay tao: ${new Date().toLocaleDateString('vi-VN')}`, 105, 30, { align: 'center' });
  
  let columns = [];
  let rows = [];
  
  // Chuyển đổi tiếng Việt sang tiếng Anh để tránh lỗi font
  const convertVietnameseToEnglish = (text) => {
    if (!text) return '';
    return text
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[ÌÍỊỈĨ]/g, 'I')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/[ỲÝỴỶỸ]/g, 'Y')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };
  
  switch (reportType) {
    case 'inventory':
      columns = ['STT', 'Ma SP', 'Ten san pham', 'Don vi', 'Ton kho', 'Vi tri'];
      rows = reportData.map((item, index) => [
        index + 1,
        item.productId?.sku || '',
        convertVietnameseToEnglish(item.productId?.name) || '',
        convertVietnameseToEnglish(item.productId?.unit) || '',
        item.quantity || 0,
        convertVietnameseToEnglish(item.productId?.location) || ''
      ]);
      break;
    case 'transactions':
      columns = ['STT', 'Ma GD', 'Loai', 'San pham', 'So luong', 'Don gia', 'Ghi chu'];
      rows = reportData.map((item, index) => {
        const id = item._id;
        const date = item.createdAt;
        const type = item.transactionType === 'Import' ? 'NK' : 'XK';
        
        let transactionCode = '-';
        if (id && date) {
          const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
          transactionCode = `${type}${dateStr}${String(id).slice(-4)}`;
        } else if (id) {
          transactionCode = `${type}${String(id).slice(-6)}`;
        }
        
        const price = item.transactionType === 'Import' 
          ? item.unitPrice 
          : item.productId?.salePrice;
        
        return [
          index + 1,
          transactionCode,
          item.transactionType === 'Import' ? 'Nhap' : 'Xuat',
          convertVietnameseToEnglish(`${item.productId?.sku} - ${item.productId?.name}`) || '',
          Math.abs(item.quantity || 0),
          (price || 0).toLocaleString() + ' dong',
          convertVietnameseToEnglish(item.note || item.customerInfo) || ''
        ];
      });
      break;
    case 'lowstock':
      columns = ['STT', 'Ma SP', 'Ten san pham', 'Ton kho', 'Vi tri'];
      rows = reportData.map((item, index) => [
        index + 1,
        item.productId?.sku || '',
        convertVietnameseToEnglish(item.productId?.name) || '',
        item.quantity || 0,
        convertVietnameseToEnglish(item.productId?.location) || ''
      ]);
      break;
    case 'expiring':
      columns = ['STT', 'Ma SP', 'Ten san pham', 'Ton kho', 'Han su dung'];
      rows = reportData.map((item, index) => [
        index + 1,
        item.productId?.sku || '',
        convertVietnameseToEnglish(item.productId?.name) || '',
        item.quantity || 0,
        item.productId?.expiryDate ? new Date(item.productId.expiryDate).toLocaleDateString('vi-VN') : ''
      ]);
      break;
    default:
      columns = ['STT', 'Ma SP', 'Ten san pham', 'Ton kho'];
      rows = reportData.map((item, index) => [
        index + 1,
        item.productId?.sku || '',
        convertVietnameseToEnglish(item.productId?.name) || '',
        item.quantity || 0
      ]);
  }
  
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      font: 'times'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  doc.save(`${reportName}-${new Date().toISOString().split('T')[0]}.pdf`);
  message.success(`Đã xuất ${reportData.length} bản ghi ra file PDF`);
};