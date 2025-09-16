import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Table, Space, DatePicker, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';
import { productAPI } from '../../services/api/productAPI';
import dayjs from 'dayjs';

const InventoryImport = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts({ limit: 100 });
      if (response.data.success) {
        const activeProducts = response.data.data.filter(p => p.IsActive !== false);
        setProducts(activeProducts);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const loadSuppliers = async () => {
    // Tạm thời dùng dữ liệu giả
    setSuppliers([
      { SupplierID: 1, Name: 'Nhà cung cấp A' },
      { SupplierID: 2, Name: 'Nhà cung cấp B' },
      { SupplierID: 3, Name: 'Nhà cung cấp C' }
    ]);
  };

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn giá', dataIndex: 'unitPrice', key: 'unitPrice', render: (value) => `${value?.toLocaleString()} đ` },
    { title: 'Thành tiền', key: 'total', render: (_, record) => `${(record.quantity * record.unitPrice)?.toLocaleString()} đ` },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record, index) => (
        <Button 
          icon={<DeleteOutlined />} 
          size="small" 
          danger 
          onClick={() => removeItem(index)}
        >
          Xóa
        </Button>
      )
    }
  ];

  const addItem = (values) => {
    const product = products.find(p => p.ProductID === values.productId);
    if (!product) {
      message.error('Vui lòng chọn sản phẩm');
      return;
    }
    
    // Kiểm tra sản phẩm đã có trong danh sách chưa
    const existingIndex = items.findIndex(item => item.productId === values.productId);
    if (existingIndex >= 0) {
      // Cập nhật số lượng nếu đã có
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += values.quantity;
      setItems(updatedItems);
    } else {
      // Thêm mới
      const newItem = {
        productId: values.productId,
        productName: `${product.SKU} - ${product.Name}`,
        quantity: values.quantity,
        unitPrice: values.unitPrice
      };
      setItems([...items, newItem]);
    }
    
    form.resetFields(['productId', 'quantity', 'unitPrice']);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onFinish = async (values) => {
    if (items.length === 0) {
      message.error('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    setLoading(true);
    try {
      // Gọi API cho từng sản phẩm
      for (const item of items) {
        const importData = {
          productID: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          supplierID: values.supplierId,
          note: values.note || 'Nhập kho'
        };
        
        await inventoryAPI.createImport(importData);
      }
      
      message.success(`Nhập kho thành công ${items.length} sản phẩm`);
      form.resetFields();
      setItems([]);
    } catch (error) {
      console.error('Import error:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi nhập kho: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Nhập kho</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Form.Item name="supplierId" label="Nhà cung cấp" rules={[{ required: true }]}>
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map(supplier => (
                <Select.Option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="importDate" label="Ngày nhập" initialValue={dayjs()}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4>Thêm sản phẩm</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Form.Item name="productId" label="Sản phẩm">
              <Select 
                placeholder="Chọn sản phẩm" 
                showSearch
                filterOption={(input, option) => {
                  const product = products.find(p => p.ProductID === option.value);
                  if (product) {
                    const searchText = `${product.SKU} ${product.Name}`.toLowerCase();
                    return searchText.includes(input.toLowerCase());
                  }
                  return false;
                }}
              >
                {products.map(product => (
                  <Select.Option key={product.ProductID} value={product.ProductID}>
                    {product.SKU} - {product.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="quantity" label="Số lượng">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitPrice" label="Đơn giá">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => form.validateFields(['productId', 'quantity', 'unitPrice']).then(addItem)}>
              Thêm
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          style={{ marginBottom: '24px' }}
        />

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
            Tổng tiền: {items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()} đ
          </div>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu phiếu nhập
            </Button>
            <Button onClick={() => { form.resetFields(); setItems([]); }} disabled={loading}>
              Hủy
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default InventoryImport;