import React from 'react';
import { Card, List, Tag, Avatar } from 'antd';
import { PictureOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const RecentTransactions = ({ transactions, loading }) => {
  const getTransactionIcon = (type) => {
    return type === 'Import' ? (
      <ArrowDownOutlined style={{ color: '#52c41a' }} />
    ) : (
      <ArrowUpOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  const getTransactionTag = (type) => {
    return (
      <Tag color={type === 'Import' ? 'green' : 'red'}>
        {type === 'Import' ? 'Nhập kho' : 'Xuất kho'}
      </Tag>
    );
  };

  return (
    <Card 
      title="Giao dịch gần nhất" 
      loading={loading}
      extra={<span style={{ fontSize: '12px', color: '#666' }}>10 giao dịch mới nhất</span>}
    >
      <List
        itemLayout="horizontal"
        dataSource={transactions}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar 
                    src={item.productId?.image ? `http://localhost:5000${item.productId.image}` : null}
                    icon={<PictureOutlined />}
                    size={32}
                    shape="square"
                  />
                  {getTransactionIcon(item.transactionType)}
                </div>
              }
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.productId?.name || 'Sản phẩm không xác định'}</span>
                  {getTransactionTag(item.transactionType)}
                </div>
              }
              description={
                <div>
                  <div>Mã SP: {item.productId?.sku || 'N/A'}</div>
                  <div>Số lượng: {Math.abs(item.quantity)} {item.productId?.unit || ''}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentTransactions;