import React, { memo, useMemo, useCallback, useState } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './ProductTable.module.css';

const ProductTable = memo(({ products, loading, onEdit, onDelete }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `${range[0]}-${range[1]} của ${total} sản phẩm`,
    pageSizeOptions: ['10', '20', '50', '100']
  });

  const handleTableChange = useCallback((paginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    }));
  }, []);

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
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
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
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <div className={styles.productTable}>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
});

ProductTable.displayName = 'ProductTable';

export default ProductTable;