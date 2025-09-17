import React from 'react';
import { Table, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const InventoryTable = ({ items, onRemove, showUnitPrice = false }) => {
  const columns = [
    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
    ...(showUnitPrice ? [] : [{ title: 'Tồn kho', dataIndex: 'availableStock', key: 'availableStock' }]),
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    ...(showUnitPrice ? [{ 
      title: 'Đơn giá', 
      dataIndex: 'unitPrice', 
      key: 'unitPrice',
      render: (value) => `${value?.toLocaleString()} đ`
    }] : []),
    ...(showUnitPrice ? [{ 
      title: 'Thành tiền', 
      key: 'total',
      render: (_, record) => `${(record.quantity * record.unitPrice)?.toLocaleString()} đ`
    }] : []),
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record, index) => (
        <Button 
          icon={<DeleteOutlined />} 
          size="small" 
          danger 
          onClick={() => onRemove(index)}
        >
          Xóa
        </Button>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      pagination={false}
      style={{ marginBottom: '24px' }}
    />
  );
};

export default InventoryTable;