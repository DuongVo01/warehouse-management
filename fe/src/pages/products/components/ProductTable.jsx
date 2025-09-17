import React from 'react';
import { Table, Button, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
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
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  const handleDelete = (product) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn vô hiệu hóa sản phẩm "${product.name}"? Sản phẩm sẽ không hiển thị trong danh sách nhưng dữ liệu vẫn được bảo tồn.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => onDelete(product._id)
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={Array.isArray(products) ? products : []}
      loading={loading}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ProductTable;