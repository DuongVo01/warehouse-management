import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Select, Button, Space, Tag, message, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined, InboxOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';

const StockBalance = () => {
  const [stockData, setStockData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

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

  useEffect(() => {
    loadStockBalance();
  }, []);



  // Filter data when search or filter changes
  useEffect(() => {
    filterData();
  }, [searchText, filterStatus, allData]);

  const filterData = () => {
    let filtered = [...allData];
    
    // Tìm kiếm
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.productId?.name?.toLowerCase().includes(search) ||
        item.productId?.sku?.toLowerCase().includes(search) ||
        item.productId?.location?.toLowerCase().includes(search)
      );
    }
    
    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        const quantity = item.quantity;
        const expiryDate = item.productId?.expiryDate;
        
        switch (filterStatus) {
          case 'low-stock':
            return quantity <= 10;
          case 'medium-stock':
            return quantity > 10 && quantity <= 50;
          case 'expiring':
            return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
          case 'normal':
            return quantity > 50 && (!expiryDate || new Date(expiryDate) > new Date(Date.now() + 30*24*60*60*1000));
          default:
            return true;
        }
      });
    }
    
    setStockData(filtered);
    
    // Tính toán thống kê
    const totalProducts = filtered.length;
    const totalQuantity = filtered.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStockCount = filtered.filter(item => item.quantity <= 10).length;
    const expiringCount = filtered.filter(item => {
      const expiryDate = item.productId?.expiryDate;
      return expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000);
    }).length;
    
    setStats({ totalProducts, totalQuantity, lowStockCount, expiringCount });
  };

  const loadStockBalance = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getBalance({ limit: 100 });
      if (response.data.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setAllData(data);
      } else {
        message.error(response.data.message || 'Không thể tải dữ liệu tồn kho');
        setAllData([]);
      }
    } catch (error) {
      console.error('Error loading stock balance:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải dữ liệu tồn kho');
      }
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (stockData.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    // Chuẩn bị dữ liệu xuất
    const exportData = stockData.map((item, index) => {
      const quantity = item.quantity;
      const expiryDate = item.productId?.expiryDate;
      let status = 'Bình thường';
      
      if (quantity <= 10) {
        status = 'Sắp hết';
      } else if (quantity <= 50) {
        status = 'Sắp cạn kiệt';
      } else if (expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000)) {
        status = 'Sắp hết hạn';
      }
      
      return {
        'STT': index + 1,
        'Mã SP': item.productId?.sku || '',
        'Tên sản phẩm': item.productId?.name || '',
        'Đơn vị': item.productId?.unit || '',
        'Tồn kho': item.quantity || 0,
        'Vị trí': item.productId?.location || '',
        'Hạn sử dụng': expiryDate ? new Date(expiryDate).toLocaleDateString('vi-VN') : '',
        'Cập nhật cuối': item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('vi-VN') : '',
        'Trạng thái': status
      };
    });

    // Tạo CSV content
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    // Tạo và tải file
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ton-kho-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`Đã xuất ${stockData.length} sản phẩm ra file Excel`);
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

      <div className="action-buttons" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo tên, SKU, vị trí..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            placeholder="Lọc trạng thái"
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="low-stock">Sắp hết</Select.Option>
            <Select.Option value="medium-stock">Sắp cạn kiệt</Select.Option>
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
        rowKey="_id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default StockBalance;