import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Upload, Avatar, message } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';

const ProductForm = ({ visible, editingProduct, form, onOk, onCancel }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingProduct?.image) {
      setImageUrl(`http://localhost:3000${editingProduct.image}`);
    } else {
      setImageUrl('');
    }
    setImageFile(null);
  }, [editingProduct]);

  const handleImageSelect = ({ file }) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    return false;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleOk = () => {
    onOk(imageFile);
  };
  return (
    <Modal
      title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      open={visible}
      onOk={handleOk}
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

        <Form.Item
          label="Hình ảnh sản phẩm"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar 
              src={imageUrl} 
              icon={<PictureOutlined />} 
              size={64}
              shape="square"
            />
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleImageSelect}
              beforeUpload={beforeUpload}
            >
              <button type="button" style={{ border: '1px solid #d9d9d9', background: '#fff', padding: '4px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                <UploadOutlined /> Chọn ảnh
              </button>
            </Upload>
            {imageFile && (
              <span style={{ color: '#666', fontSize: '12px' }}>
                Đã chọn: {imageFile.name}
              </span>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;