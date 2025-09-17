import React from 'react';
import { Table, Tag } from 'antd';

const StockTable = ({ data, loading }) => {
  const columns = [
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
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="_id"
      pagination={{ pageSize: 20 }}
      scroll={{ x: 1000 }}
    />
  );
};

export default StockTable;