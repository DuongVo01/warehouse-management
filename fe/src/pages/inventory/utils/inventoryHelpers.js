export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);
};

export const validateInventoryForm = (items, formValues, isExport = false) => {
  if (items.length === 0) {
    return 'Vui lòng thêm ít nhất một sản phẩm';
  }
  
  if (isExport && !formValues.customerInfo) {
    return 'Vui lòng nhập thông tin khách hàng';
  }
  
  if (!isExport && !formValues.supplierId) {
    return 'Vui lòng chọn nhà cung cấp';
  }
  
  return null;
};

export const prepareInventoryData = (items, formValues, isExport = false) => {
  return items.map(item => ({
    productId: item.productId,
    quantity: isExport ? item.quantity : item.quantity,
    unitPrice: item.unitPrice,
    ...(isExport ? {
      customerInfo: formValues.customerInfo,
      note: formValues.note || 'Xuất kho'
    } : {
      supplierId: formValues.supplierId,
      note: formValues.note || 'Nhập kho'
    })
  }));
};