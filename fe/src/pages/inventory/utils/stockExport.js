import { message } from 'antd';

export const exportStockData = (stockData) => {
  if (stockData.length === 0) {
    message.warning('Không có dữ liệu để xuất');
    return;
  }

  const exportData = stockData.map((item, index) => {
    const quantity = item.quantity;
    const expiryDate = item.productId?.expiryDate;
    let status = 'Bình thường';
    
    if (quantity <= 10) {
      status = 'Sắp hết';
    } else if (quantity <= 50) {
      status = 'Sắp cạn kiệt';
    } else if (expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000)) {
      status = 'Sắp hết hạn';
    }
    
    return {
      'STT': index + 1,
      'Mã SP': item.productId?.sku || '',
      'Tên sản phẩm': item.productId?.name || '',
      'Đơn vị': item.productId?.unit || '',
      'Tồn kho': item.quantity || 0,
      'Vị trí': item.productId?.location || '',
      'Hạn sử dụng': expiryDate ? new Date(expiryDate).toLocaleDateString('vi-VN') : '',
      'Cập nhật cuối': item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('vi-VN') : '',
      'Trạng thái': status
    };
  });

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
  link.setAttribute('download', `ton-kho-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  message.success(`Đã xuất ${stockData.length} sản phẩm ra file Excel`);
};