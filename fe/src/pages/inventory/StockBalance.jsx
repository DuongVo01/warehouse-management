import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';

const StockBalance = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    status: ''
  });

  const columns = [
    { title: 'Mã SP', dataIndex: 'sku', key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity', 
      render: (value, record) => (
        <span style={{ color: value <= 10 ? '#ff4d4f' : '#52c41a' }}>
          {value}
        </span>
      )
    },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { title: 'Hạn sử dụng', dataIndex: 'expiryDate', key: 'expiryDate' },
    { 
      title: 'Trạng thái', 
      key: 'status',
      render: (_, record) => {
        if (record.quantity <= 10) {
          return <Tag color="red">Sắp hết</Tag>;
        }
        if (record.expiryDate && new Date(record.expiryDate) <= new Date(Date.now() + 30*24*60*60*1000)) {
          return <Tag color="orange">Sắp hết hạn</Tag>;
        }
        return <Tag color="green">Bình thường</Tag>;
      }
    }
  ];

  useEffect(() => {
    loadStockBalance();
  }, [filters]);

  const loadStockBalance = async () => {
    setLoading(true);
    try {
      // API call here
      setStockData([]);
    } catch (error) {
      console.error('Error loading stock balance:', error);
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

      <div className="action-buttons">
        <Space>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Vị trí kho"
            value={filters.location}
            onChange={(value) => setFilters({...filters, location: value})}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="A1">Kệ A1</Select.Option>
            <Select.Option value="A2">Kệ A2</Select.Option>
            <Select.Option value="B1">Kệ B1</Select.Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            value={filters.status}
            onChange={(value) => setFilters({...filters, status: value})}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="low">Sắp hết</Select.Option>
            <Select.Option value="expiring">Sắp hết hạn</Select.Option>
            <Select.Option value="normal">Bình thường</Select.Option>
          </Select>
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
        rowKey="productId"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default StockBalance;