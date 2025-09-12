import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Table, Space, DatePicker, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const InventoryImport = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

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
    const product = products.find(p => p.productId === values.productId);
    const newItem = {
      productId: values.productId,
      productName: product?.name,
      quantity: values.quantity,
      unitPrice: values.unitPrice
    };
    setItems([...items, newItem]);
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

    try {
      const importData = {
        ...values,
        items
      };
      // API call here
      message.success('Nhập kho thành công');
      form.resetFields();
      setItems([]);
    } catch (error) {
      message.error('Lỗi nhập kho');
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
                <Select.Option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="importDate" label="Ngày nhập" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h4>Thêm sản phẩm</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <Form.Item name="productId" label="Sản phẩm">
              <Select placeholder="Chọn sản phẩm">
                {products.map(product => (
                  <Select.Option key={product.productId} value={product.productId}>
                    {product.name}
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

        <Space>
          <Button type="primary" htmlType="submit">
            Lưu phiếu nhập
          </Button>
          <Button onClick={() => { form.resetFields(); setItems([]); }}>
            Hủy
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default InventoryImport;