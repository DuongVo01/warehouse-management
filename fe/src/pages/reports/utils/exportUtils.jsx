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
        'Mã SP': item.Product?.SKU || '',
        'Tên sản phẩm': item.Product?.Name || '',
        'Đơn vị': item.Product?.Unit || '',
        'Tồn kho': item.Quantity || 0,
        'Vị trí': item.Product?.Location || '',
        'Ngày báo cáo': new Date().toLocaleDateString('vi-VN')
      }));
      break;
    case 'transactions':
      exportData = reportData.map((item, index) => {
        const id = item.TransactionID || item.transaction_i_d;
        const date = item.CreatedAt || item.created_at;
        const quantity = item.Quantity || item.quantity || 0;
        const type = quantity > 0 ? 'NK' : 'XK';
        
        let transactionCode = '-';
        if (id && date) {
          const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
          transactionCode = `${type}${dateStr}${String(id).padStart(4, '0')}`;
        } else if (id) {
          transactionCode = `${type}${String(id).padStart(6, '0')}`;
        }
        
        return {
          'STT': index + 1,
          'Mã GD': transactionCode,
          'Loại': quantity > 0 ? 'Nhập' : 'Xuất',
          'Sản phẩm': item.Product?.Name || item.Product?.name || '',
          'Số lượng': Math.abs(quantity),
          'Đơn giá': item.UnitPrice || item.unit_price || 0,
          'Ngày': date ? new Date(date).toLocaleDateString('vi-VN') : '-'
        };
      });
      break;
    default:
      exportData = reportData.map((item, index) => ({
        'STT': index + 1,
        'Mã SP': item.Product?.SKU || '',
        'Tên sản phẩm': item.Product?.Name || '',
        'Tồn kho': item.Quantity || 0
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
        item.Product?.SKU || '',
        convertVietnameseToEnglish(item.Product?.Name) || '',
        convertVietnameseToEnglish(item.Product?.Unit) || '',
        item.Quantity || 0,
        convertVietnameseToEnglish(item.Product?.Location) || ''
      ]);
      break;
    case 'transactions':
      columns = ['STT', 'Ma GD', 'Loai', 'San pham', 'So luong', 'Don gia'];
      rows = reportData.map((item, index) => {
        const id = item.TransactionID || item.transaction_i_d;
        const date = item.CreatedAt || item.created_at;
        const quantity = item.Quantity || item.quantity || 0;
        const type = quantity > 0 ? 'NK' : 'XK';
        
        let transactionCode = '-';
        if (id && date) {
          const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
          transactionCode = `${type}${dateStr}${String(id).padStart(4, '0')}`;
        } else if (id) {
          transactionCode = `${type}${String(id).padStart(6, '0')}`;
        }
        
        return [
          index + 1,
          transactionCode,
          quantity > 0 ? 'Nhap' : 'Xuat',
          convertVietnameseToEnglish(item.Product?.Name || item.Product?.name) || '',
          Math.abs(quantity),
          (item.UnitPrice || item.unit_price || 0).toLocaleString() + ' dong'
        ];
      });
      break;
    default:
      columns = ['STT', 'Ma SP', 'Ten san pham', 'Ton kho'];
      rows = reportData.map((item, index) => [
        index + 1,
        item.Product?.SKU || '',
        convertVietnameseToEnglish(item.Product?.Name) || '',
        item.Quantity || 0
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