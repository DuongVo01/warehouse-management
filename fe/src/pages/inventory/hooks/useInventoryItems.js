import { useState } from 'react';
import { message } from 'antd';

export const useInventoryItems = (products) => {
  const [items, setItems] = useState([]);

  const addItem = (values, isExport = false) => {
    const product = products.find(p => p._id === values.productId);
    if (!product) {
      message.error('Vui lòng chọn sản phẩm');
      return false;
    }
    
    if (isExport && values.quantity > product.quantity) {
      message.error('Số lượng xuất vượt quá tồn kho');
      return false;
    }

    // Kiểm tra sản phẩm đã có trong danh sách chưa
    const productId = isExport ? product.productId._id : product._id;
    const existingIndex = items.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingIndex].quantity + values.quantity;
      
      if (isExport && newQuantity > product.quantity) {
        message.error('Tổng số lượng xuất vượt quá tồn kho');
        return false;
      }
      
      updatedItems[existingIndex].quantity = newQuantity;
      if (!isExport && values.unitPrice) {
        updatedItems[existingIndex].unitPrice = values.unitPrice;
      }
      setItems(updatedItems);
    } else {
      const newItem = {
        productId,
        productName: isExport 
          ? `${product.productId?.sku} - ${product.productId?.name}`
          : `${product.sku} - ${product.name}`,
        productImage: isExport ? product.productId?.image : product.image,
        availableStock: isExport ? product.quantity : undefined,
        quantity: values.quantity,
        unitPrice: values.unitPrice || undefined
      };
      setItems([...items, newItem]);
    }
    
    return true;
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearItems = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    clearItems
  };
};