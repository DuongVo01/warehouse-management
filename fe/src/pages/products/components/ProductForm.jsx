import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Upload, Avatar, message, Row, Col, Divider } from 'antd';
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
      width={700}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <Form
        form={form}
        layout="vertical"
        name="productForm"
        size="middle"
      >
        {/* Thông tin cơ bản */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#262626', fontSize: '14px', fontWeight: 600 }}>
            Thông tin cơ bản
          </h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="Mã sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input placeholder="Nhập mã sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Đơn vị"
                rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input placeholder="kg, thùng, chai..." />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Thông tin giá cả */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#262626', fontSize: '14px', fontWeight: 600 }}>
            Thông tin giá cả
          </h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="costPrice"
                label="Giá nhập"
                style={{ marginBottom: '16px' }}
              >
                <InputNumber
                  placeholder="Nhập giá nhập"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salePrice"
                label="Giá bán"
                style={{ marginBottom: '16px' }}
              >
                <InputNumber
                  placeholder="Nhập giá bán"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Thông tin khác */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#262626', fontSize: '14px', fontWeight: 600 }}>
            Thông tin khác
          </h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expiryDate"
                label="Ngày hết hạn"
                style={{ marginBottom: '16px' }}
              >
                <DatePicker
                  placeholder="Chọn ngày hết hạn"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Vị trí"
                style={{ marginBottom: '16px' }}
              >
                <Input placeholder="Nhập vị trí lưu trữ" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Hình ảnh */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', color: '#262626', fontSize: '14px', fontWeight: 600 }}>
            Hình ảnh sản phẩm
          </h4>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px',
            border: '1px dashed #d9d9d9'
          }}>
            <Avatar 
              src={imageUrl} 
              icon={<PictureOutlined />} 
              size={80}
              shape="square"
              style={{ 
                background: '#fff',
                border: '2px solid #e6f7ff'
              }}
            />
            <div style={{ flex: 1 }}>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={handleImageSelect}
                beforeUpload={beforeUpload}
              >
                <button 
                  type="button" 
                  style={{ 
                    border: '1px solid #1890ff', 
                    background: '#fff', 
                    color: '#1890ff',
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#1890ff';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.color = '#1890ff';
                  }}
                >
                  <UploadOutlined /> Chọn ảnh
                </button>
              </Upload>
              {imageFile && (
                <div style={{ 
                  marginTop: '8px',
                  padding: '4px 8px',
                  background: '#e6f7ff',
                  borderRadius: '4px',
                  color: '#1890ff',
                  fontSize: '12px',
                  display: 'inline-block'
                }}>
                  ✓ Đã chọn: {imageFile.name}
                </div>
              )}
              <div style={{ 
                marginTop: '4px',
                fontSize: '12px',
                color: '#8c8c8c'
              }}>
                Hỗ trợ JPG, PNG. Tối đa 2MB
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ProductForm;