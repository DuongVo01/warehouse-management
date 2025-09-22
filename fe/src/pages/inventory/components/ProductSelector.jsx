import React from 'react';
import { Form, Select, InputNumber, Button, Avatar } from 'antd';
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';

const ProductSelector = ({ 
  products, 
  onAdd, 
  form, 
  showUnitPrice = false,
  isExport = false 
}) => {
  const handleAdd = () => {
    form.validateFields(['productId', 'quantity', ...(showUnitPrice ? ['unitPrice'] : [])])
      .then(onAdd);
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
      <h4>{isExport ? 'Thêm sản phẩm xuất' : 'Thêm sản phẩm'}</h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showUnitPrice ? '2fr 1fr 1fr auto' : '2fr 1fr auto', 
        gap: '16px', 
        alignItems: 'end' 
      }}>
        <Form.Item name="productId" label="Sản phẩm">
          <Select 
            placeholder="Chọn sản phẩm"
            showSearch
            filterOption={(input, option) => {
              const product = products.find(p => p._id === option.value);
              const searchField = isExport ? product?.productId : product;
              if (searchField) {
                const searchText = `${searchField.sku} ${searchField.name}`.toLowerCase();
                return searchText.includes(input.toLowerCase());
              }
              return false;
            }}
          >
            {products.map(product => {
              const displayProduct = isExport ? product.productId : product;
              return (
                <Select.Option key={product._id} value={product._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar 
                      src={displayProduct?.image ? `http://localhost:5000${displayProduct.image}` : null} 
                      icon={<PictureOutlined />}
                      size={24}
                      shape="square"
                    />
                    <span>
                      {displayProduct?.sku} - {displayProduct?.name}
                      {isExport && ` (Tồn: ${product.quantity})`}
                    </span>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        
        <Form.Item name="quantity" label="Số lượng">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        
        {showUnitPrice && (
          <Form.Item name="unitPrice" label="Đơn giá">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}
        
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm
        </Button>
      </div>
    </div>
  );
};

export default ProductSelector;