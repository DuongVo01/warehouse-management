import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Select } from 'antd';

const CategoryModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  editingCategory, 
  form 
}) => {
  useEffect(() => {
    if (visible && editingCategory) {
      form.setFieldsValue(editingCategory);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, editingCategory, form]);

  const handleSubmit = async (values) => {
    const success = editingCategory 
      ? await onSubmit.update(editingCategory._id, values)
      : await onSubmit.create(values);
    
    if (success) {
      onCancel();
    }
  };

  return (
    <Modal
      title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea 
            placeholder="Nhập mô tả danh mục" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue="active"
        >
          <Select>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;