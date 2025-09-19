import React, { useState, useCallback } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import styles from './StockCheckTable.module.css';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const StockCheckTable = ({ 
  stockChecks, 
  loading, 
  userRole, 
  onViewDetail, 
  onApprove, 
  onReject 
}) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `${range[0]}-${range[1]} của ${total} phiếu kiểm kê`,
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
    { title: 'Mã kiểm kê', dataIndex: 'checkId', key: 'checkId' },
    { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'productName' },
    { title: 'Số lượng hệ thống', dataIndex: 'systemQuantity', key: 'systemQuantity' },
    { title: 'Số lượng thực tế', dataIndex: 'actualQuantity', key: 'actualQuantity' },
    { 
      title: 'Chênh lệch', 
      key: 'difference',
      render: (_, record) => {
        const diff = (record.actualQuantity || 0) - (record.systemQuantity || 0);
        return (
          <span style={{ 
            color: diff > 0 ? '#52c41a' : diff < 0 ? '#ff4d4f' : '#666',
            fontWeight: 'bold'
          }}>
            {diff > 0 ? '+' : ''}{diff}
          </span>
        );
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'orange', text: 'Chờ duyệt' },
          'Approved': { color: 'green', text: 'Đã duyệt' },
          'Rejected': { color: 'red', text: 'Từ chối' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { title: 'Người tạo', dataIndex: ['createdBy', 'fullName'], key: 'creator' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => onViewDetail(record)}>
            Xem
          </Button>
          {record.status === 'Pending' && userRole === 'Admin' && (
            <>
              <Button icon={<CheckOutlined />} size="small" type="primary" onClick={() => onApprove(record._id)}>
                Duyệt
              </Button>
              <Button icon={<CloseOutlined />} size="small" danger onClick={() => onReject(record._id)}>
                Từ chối
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className={styles.stockCheckTable}>
      <Table
        columns={columns}
        dataSource={stockChecks}
        loading={loading}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default StockCheckTable;