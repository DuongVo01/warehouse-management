import React from 'react';
import { Modal, Form, Select, Row, Col, InputNumber, Input, Button, Space } from 'antd';

const StockCheckForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  products, 
  currentStock, 
  onProductChange 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const result = await onSubmit(values);
    if (result.success) {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Tạo phiếu kiểm kê"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true }]}>
          <Select 
            placeholder="Chọn sản phẩm" 
            showSearch
            filterOption={(input, option) => {
              const text = option.children || '';
              return text.toString().toLowerCase().includes(input.toLowerCase());
            }}
            onChange={onProductChange}
          >
            {products.map(product => (
              <Select.Option key={product._id} value={product._id}>
                {product.sku} - {product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Số lượng hệ thống">
              <InputNumber value={currentStock} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="actualQuantity" label="Số lượng thực tế" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Tạo phiếu
            </Button>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StockCheckForm;