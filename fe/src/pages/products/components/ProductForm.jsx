import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';

const ProductForm = ({ visible, editingProduct, form, onOk, onCancel }) => {
  return (
    <Modal
      title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingProduct ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="productForm"
      >
        <Form.Item
          name="sku"
          label="Mã sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
        >
          <Input placeholder="Nhập mã sản phẩm" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Đơn vị"
          rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
        >
          <Input placeholder="Nhập đơn vị (kg, thùng, chai...)" />
        </Form.Item>

        <Form.Item
          name="costPrice"
          label="Giá nhập"
        >
          <InputNumber
            placeholder="Nhập giá nhập"
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="salePrice"
          label="Giá bán"
        >
          <InputNumber
            placeholder="Nhập giá bán"
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Ngày hết hạn"
        >
          <DatePicker
            placeholder="Chọn ngày hết hạn"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Vị trí"
        >
          <Input placeholder="Nhập vị trí lưu trữ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;