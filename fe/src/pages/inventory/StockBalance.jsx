import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Select, Button, Space, Tag, message, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined, InboxOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';

const StockBalance = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

  const columns = [
    { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'productName' },
    { title: 'Đơn vị', dataIndex: ['Product', 'Unit'], key: 'unit' },
    { 
      title: 'Tồn kho', 
      dataIndex: 'Quantity', 
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
    { title: 'Vị trí', dataIndex: ['Product', 'Location'], key: 'location' },
    { 
      title: 'Hạn sử dụng', 
      dataIndex: ['Product', 'ExpiryDate'], 
      key: 'expiryDate',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    { 
      title: 'Cập nhật cuối', 
      dataIndex: 'LastUpdated', 
      key: 'lastUpdated',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'
    },
    { 
      title: 'Trạng thái', 
      key: 'status',
      render: (_, record) => {
        const quantity = record.Quantity;
        const expiryDate = record.Product?.ExpiryDate;
        
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

  useEffect(() => {
    loadStockBalance();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStockBalance();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const loadStockBalance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchText.trim()) {
        params.ProductID = searchText; // Tìm theo ID hoặc có thể mở rộng
      }
      
      const response = await inventoryAPI.getBalance(params);
      if (response.data.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setStockData(data);
        
        // Tính toán thống kê
        const totalProducts = data.length;
        const totalQuantity = data.reduce((sum, item) => sum + (item.Quantity || 0), 0);
        const lowStockCount = data.filter(item => item.Quantity <= 10).length;
        const expiringCount = data.filter(item => {
          const expiryDate = item.Product?.ExpiryDate;
          return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
        }).length;
        
        setStats({ totalProducts, totalQuantity, lowStockCount, expiringCount });
      } else {
        message.error(response.data.message || 'Không thể tải dữ liệu tồn kho');
        setStockData([]);
      }
    } catch (error) {
      console.error('Error loading stock balance:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải dữ liệu tồn kho');
      }
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export to Excel logic
    console.log('Exporting stock balance...');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Tồn kho</h2>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số lượng"
              value={stats.totalQuantity}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm sắp hết"
              value={stats.lowStockCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm sắp hết hạn"
              value={stats.expiringCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="action-buttons">
        <Space>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Button icon={<ReloadOutlined />} onClick={loadStockBalance}>
            Làm mới
          </Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
            Xuất Excel
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={stockData}
        loading={loading}
        rowKey="ProductID"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default StockBalance;