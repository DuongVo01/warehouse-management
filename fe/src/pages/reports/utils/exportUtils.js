import { message } from 'antd';

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