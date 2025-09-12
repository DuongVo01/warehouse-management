import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const columns = [
    { title: 'Mã SP', dataIndex: 'sku', key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    { title: 'Giá nhập', dataIndex: 'costPrice', key: 'costPrice', render: (value) => `${value?.toLocaleString()} đ` },
    { title: 'Giá bán', dataIndex: 'salePrice', key: 'salePrice', render: (value) => `${value?.toLocaleString()} đ` },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small">Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // API call here
      setProducts([]);
    } catch (error) {
      message.error('Lỗi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
      </div>
      
      <div className="action-buttons">
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm sản phẩm
          </Button>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="productId"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductList;