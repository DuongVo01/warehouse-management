import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Table, Space, DatePicker, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const InventoryExport = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

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
    const product = products.find(p => p.productId === values.productId);
    if (values.quantity > product?.availableStock) {
      message.error('Số lượng xuất vượt quá tồn kho');
      return;
    }

    const newItem = {
      productId: values.productId,
      productName: product?.name,
      availableStock: product?.availableStock,
      quantity: values.quantity
    };
    setItems([...items, newItem]);
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

    try {
      const exportData = {
        ...values,
        items
      };
      // API call here
      message.success('Xuất kho thành công');
      form.resetFields();
      setItems([]);
    } catch (error) {
      message.error('Lỗi xuất kho');
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
          <Form.Item name="exportDate" label="Ngày xuất" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4>Thêm sản phẩm xuất</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Form.Item name="productId" label="Sản phẩm">
              <Select placeholder="Chọn sản phẩm">
                {products.map(product => (
                  <Select.Option key={product.productId} value={product.productId}>
                    {product.name} (Tồn: {product.availableStock})
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
          <Button type="primary" htmlType="submit">
            Lưu phiếu xuất
          </Button>
          <Button onClick={() => { form.resetFields(); setItems([]); }}>
            Hủy
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default InventoryExport;