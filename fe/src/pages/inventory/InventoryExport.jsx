import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Space, DatePicker, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';
import dayjs from 'dayjs';

const InventoryExport = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await inventoryAPI.getBalance({ limit: 100 });
      if (response.data.success) {
        const productsWithStock = response.data.data.filter(item => item.Quantity > 0);
        setProducts(productsWithStock);
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Tồn kho', dataIndex: 'availableStock', key: 'availableStock' },
    { title: 'Số lượng xuất', dataIndex: 'quantity', key: 'quantity' },
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
    
    if (values.quantity > product.Quantity) {
      message.error('Số lượng xuất vượt quá tồn kho');
      return;
    }

    // Kiểm tra sản phẩm đã có trong danh sách chưa
    const existingIndex = items.findIndex(item => item.productId === values.productId);
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingIndex].quantity + values.quantity;
      if (newQuantity > product.Quantity) {
        message.error('Tổng số lượng xuất vượt quá tồn kho');
        return;
      }
      updatedItems[existingIndex].quantity = newQuantity;
      setItems(updatedItems);
    } else {
      const newItem = {
        productId: values.productId,
        productName: `${product.Product?.SKU} - ${product.Product?.Name}`,
        availableStock: product.Quantity,
        quantity: values.quantity
      };
      setItems([...items, newItem]);
    }
    
    form.resetFields(['productId', 'quantity']);
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
        const exportData = {
          productID: item.productId,
          quantity: item.quantity,
          customerInfo: values.customerInfo,
          note: values.note || 'Xuất kho'
        };
        
        await inventoryAPI.createExport(exportData);
      }
      
      message.success(`Xuất kho thành công ${items.length} sản phẩm`);
      form.resetFields();
      setItems([]);
      loadProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error('Export error:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi xuất kho: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Xuất kho</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Form.Item name="customerInfo" label="Thông tin khách hàng" rules={[{ required: true }]}>
            <Input placeholder="Tên khách hàng hoặc mã đơn hàng" />
          </Form.Item>
          <Form.Item name="exportDate" label="Ngày xuất" initialValue={dayjs()}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4>Thêm sản phẩm xuất</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Form.Item name="productId" label="Sản phẩm">
              <Select 
                placeholder="Chọn sản phẩm"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {products.map(product => (
                  <Select.Option key={product.ProductID} value={product.ProductID}>
                    {product.Product?.SKU} - {product.Product?.Name} (Tồn: {product.Quantity})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="quantity" label="Số lượng">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => form.validateFields(['productId', 'quantity']).then(addItem)}>
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

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu phiếu xuất
          </Button>
          <Button onClick={() => { form.resetFields(); setItems([]); }} disabled={loading}>
            Hủy
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default InventoryExport;