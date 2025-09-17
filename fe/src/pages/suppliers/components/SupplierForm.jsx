import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

const SupplierForm = ({ 
  visible, 
  editingSupplier, 
  form, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Modal
      title={editingSupplier ? 'Sửa thông tin nhà cung cấp' : 'Thêm nhà cung cấp mới'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Tên nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="taxCode"
          label="Mã số thuế"
        >
          <Input placeholder="Nhập mã số thuế (không bắt buộc)" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label="Địa chỉ"
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ đầy đủ" />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Space>
            <Button onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default SupplierForm;