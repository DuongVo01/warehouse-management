import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';

const ProductForm = ({ 
  visible, 
  editingProduct, 
  form, 
  onOk, 
  onCancel 
}) => {
  return (
    <Modal
      title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingProduct ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="sku" label="Mã sản phẩm" rules={[{ required: true }]}>
          <Input placeholder="Nhập mã sản phẩm" disabled={!!editingProduct} />
        </Form.Item>
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
          <Input placeholder="Nhập đơn vị (cái, kg, lít...)" />
        </Form.Item>
        <Form.Item name="costPrice" label="Giá nhập" rules={[{ required: true }]}>
          <InputNumber placeholder="Nhập giá nhập" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="salePrice" label="Giá bán" rules={[{ required: true }]}>
          <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="expiryDate" label="Ngày hết hạn">
          <DatePicker placeholder="Chọn ngày hết hạn" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="location" label="Vị trí">
          <Input placeholder="Nhập vị trí lưu trữ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;