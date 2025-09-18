import React, { memo, useMemo, useCallback } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ProductTable = memo(({ products, loading, onEdit, onDelete }) => {
  const handleEdit = useCallback((record) => {
    onEdit(record);
  }, [onEdit]);

  const handleDelete = useCallback((recordId) => {
    onDelete(recordId);
  }, [onDelete]);

  const columns = useMemo(() => [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Giá nhập',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (price) => price ? `${price.toLocaleString()} VND` : '-',
    },
    {
      title: 'Giá bán',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (price) => price ? `${price.toLocaleString()} VND` : '-',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} sản phẩm`,
      }}
    />
  );
});

ProductTable.displayName = 'ProductTable';

export default ProductTable;