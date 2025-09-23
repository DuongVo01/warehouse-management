import React from 'react';
import { Card, Table, Tag, Avatar, Tabs } from 'antd';
import { PictureOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const AlertsTable = ({ lowStockItems, expiringItems, expiredItems, loading }) => {
  const lowStockColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['productId', 'image'],
      key: 'image',
      width: 60,
      render: (image) => (
        <Avatar 
          src={image ? `http://localhost:5000${image}` : null} 
          icon={<PictureOutlined />}
          size={32}
          shape="square"
        />
      )
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: ['productId', 'sku'],
      key: 'sku',
      render: (sku) => <strong>{sku}</strong>
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['productId', 'name'],
      key: 'name'
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity <= 5 ? 'red' : 'orange'}>
          {quantity} {quantity <= 5 ? '(Rất ít)' : '(Sắp hết)'}
        </Tag>
      )
    },
    {
      title: 'Đơn vị',
      dataIndex: ['productId', 'unit'],
      key: 'unit'
    },
    {
      title: 'Vị trí',
      dataIndex: ['productId', 'location'],
      key: 'location'
    }
  ];

  const expiringColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['productId', 'image'],
      key: 'image',
      width: 60,
      render: (image) => (
        <Avatar 
          src={image ? `http://localhost:5000${image}` : null} 
          icon={<PictureOutlined />}
          size={32}
          shape="square"
        />
      )
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: ['productId', 'sku'],
      key: 'sku',
      render: (sku) => <strong>{sku}</strong>
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['productId', 'name'],
      key: 'name'
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => `${quantity} ${record.productId?.unit || ''}`
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: ['productId', 'expiryDate'],
      key: 'expiryDate',
      render: (date) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <div>{expiryDate.toLocaleDateString('vi-VN')}</div>
            <Tag color={daysLeft <= 7 ? 'red' : 'orange'}>
              {daysLeft <= 0 ? 'Đã hết hạn' : `Còn ${daysLeft} ngày`}
            </Tag>
          </div>
        );
      }
    },
    {
      title: 'Vị trí',
      dataIndex: ['productId', 'location'],
      key: 'location'
    }
  ];

  return (
    <Card 
      title="Cảnh báo chi tiết" 
      loading={loading}
      extra={<span style={{ fontSize: '12px', color: '#666' }}>Sản phẩm cần chú ý</span>}
    >
      <Tabs defaultActiveKey="lowStock">
        <TabPane 
          tab={
            <span>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              Sắp hết hàng ({lowStockItems.length})
            </span>
          } 
          key="lowStock"
        >
          <Table
            columns={lowStockColumns}
            dataSource={lowStockItems}
            rowKey="_id"
            pagination={{ pageSize: 5, showSizeChanger: false }}
            size="small"
            locale={{
              emptyText: 'Không có sản phẩm sắp hết hàng'
            }}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <WarningOutlined style={{ color: '#fa8c16' }} />
              Sắp hết hạn ({expiringItems.length})
            </span>
          } 
          key="expiring"
        >
          <Table
            columns={expiringColumns}
            dataSource={expiringItems}
            rowKey="_id"
            pagination={{ pageSize: 5, showSizeChanger: false }}
            size="small"
            locale={{
              emptyText: 'Không có sản phẩm sắp hết hạn'
            }}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <WarningOutlined style={{ color: '#cf1322' }} />
              Đã hết hạn ({expiredItems.length})
            </span>
          } 
          key="expired"
        >
          <Table
            columns={expiringColumns}
            dataSource={expiredItems}
            rowKey="_id"
            pagination={{ pageSize: 5, showSizeChanger: false }}
            size="small"
            locale={{
              emptyText: 'Không có sản phẩm đã hết hạn'
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AlertsTable;