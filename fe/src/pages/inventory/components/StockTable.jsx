import React, { useState, useCallback } from 'react';
import { Table, Tag, Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import styles from './StockTable.module.css';

const StockTable = ({ data, loading }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
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
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['productId', 'image'],
      key: 'image',
      width: 60,
      render: (image) => (
        <Avatar 
          src={image ? `http://localhost:3000${image}` : null} 
          icon={<PictureOutlined />}
          size={32}
          shape="square"
        />
      )
    },
    { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'productName' },
    { title: 'Đơn vị', dataIndex: ['productId', 'unit'], key: 'unit' },
    { 
      title: 'Tồn kho', 
      dataIndex: 'quantity', 
      key: 'quantity',
      render: (value) => (
        <span style={{ 
          color: value <= 10 ? '#ff4d4f' : value <= 50 ? '#fa8c16' : '#52c41a',
          fontWeight: 'bold'
        }}>
          {value?.toLocaleString()}
        </span>
      )
    },
    { title: 'Vị trí', dataIndex: ['productId', 'location'], key: 'location' },
    { 
      title: 'Hạn sử dụng', 
      dataIndex: ['productId', 'expiryDate'], 
      key: 'expiryDate',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    { 
      title: 'Cập nhật cuối', 
      dataIndex: 'lastUpdated', 
      key: 'lastUpdated',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    { 
      title: 'Trạng thái', 
      key: 'status',
      render: (_, record) => {
        const quantity = record.quantity;
        const expiryDate = record.productId?.expiryDate;
        
        if (quantity <= 10) {
          return <Tag color="red">Sắp hết</Tag>;
        }
        if (quantity <= 50) {
          return <Tag color="orange">Sắp cạn kiệt</Tag>;
        }
        if (expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000)) {
          return <Tag color="volcano">Sắp hết hạn</Tag>;
        }
        return <Tag color="green">Bình thường</Tag>;
      }
    }
  ];

  return (
    <div className={styles.stockTable}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default StockTable;