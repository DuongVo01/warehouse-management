import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Button, Table, Select, Space, message, Statistic, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, BarChartOutlined, RiseOutlined, WarningOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ReportList = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [reportData, setReportData] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

  const reportTypes = [
    { value: 'inventory', label: 'Báo cáo tồn kho' },
    { value: 'transactions', label: 'Báo cáo giao dịch' },
    { value: 'lowstock', label: 'Sản phẩm sắp hết' },
    { value: 'expiring', label: 'Sản phẩm sắp hết hạn' }
  ];

  const inventoryColumns = [
    { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
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
      title: 'Trạng thái', 
      key: 'status',
      render: (_, record) => {
        const quantity = record.Quantity;
        if (quantity <= 10) return <Tag color="red">Sắp hết</Tag>;
        if (quantity <= 50) return <Tag color="orange">Sắp cạn kiệt</Tag>;
        return <Tag color="green">Bình thường</Tag>;
      }
    }
  ];

  const transactionColumns = [
    { title: 'Mã GD', key: 'id', 
      render: (_, record) => {
        const id = record.TransactionID || record.transaction_i_d;
        const date = record.CreatedAt || record.created_at;
        const quantity = record.Quantity || record.quantity || 0;
        const type = quantity > 0 ? 'NK' : 'XK'; // NK = Nhập kho, XK = Xuất kho
        
        if (id && date) {
          const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
          return `${type}${dateStr}${String(id).padStart(4, '0')}`;
        }
        return id ? `${type}${String(id).padStart(6, '0')}` : '-';
      }
    },
    { title: 'Loại', key: 'type', 
      render: (_, record) => {
        const type = record.TransactionType || record.transaction_type;
        const quantity = record.Quantity || record.quantity || 0;
        // Xác định loại dựa trên số lượng
        const actualType = quantity > 0 ? 'Import' : 'Export';
        return (
          <Tag color={actualType === 'Import' ? 'green' : 'red'}>
            {actualType === 'Import' ? 'Nhập' : 'Xuất'}
          </Tag>
        );
      }
    },
    { title: 'Sản phẩm', key: 'product',
      render: (_, record) => record.Product?.Name || record.Product?.name || '-'
    },
    { title: 'Số lượng', key: 'quantity',
      render: (_, record) => {
        const quantity = record.Quantity || record.quantity || 0;
        return Math.abs(quantity);
      }
    },
    { title: 'Đơn giá', key: 'price', 
      render: (_, record) => {
        const price = record.UnitPrice || record.unit_price;
        return price ? `${price.toLocaleString()} đ` : '-';
      }
    },
    { title: 'Ngày', key: 'date',
      render: (_, record) => {
        const date = record.CreatedAt || record.created_at;
        return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
      }
    }
  ];

  const lowStockColumns = [
    { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
    { title: 'Tồn kho', dataIndex: 'Quantity', key: 'quantity',
      render: (value) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{value}</span>
    },
    { title: 'Vị trí', dataIndex: ['Product', 'Location'], key: 'location' }
  ];

  const expiringColumns = [
    { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
    { title: 'Tồn kho', dataIndex: 'Quantity', key: 'quantity' },
    { title: 'Hạn sử dụng', dataIndex: ['Product', 'ExpiryDate'], key: 'expiry',
      render: (date) => (
        <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      )
    }
  ];

  useEffect(() => {
    loadStats();
    generateReport();
  }, []);

  useEffect(() => {
    generateReport();
  }, [reportType]);

  const loadStats = async () => {
    try {
      const response = await inventoryAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let response;
      switch (reportType) {
        case 'inventory':
          response = await inventoryAPI.getBalance({ limit: 100 });
          break;
        case 'transactions':
          response = await inventoryAPI.getTransactionHistory({ limit: 100 });
          break;
        case 'lowstock':
          response = await inventoryAPI.getLowStockProducts();
          break;
        case 'expiring':
          response = await inventoryAPI.getExpiringProducts();
          break;
        default:
          response = { data: { success: true, data: [] } };
      }
      
      if (response.data.success) {
        const data = response.data.data || [];
        console.log('Report data:', data);
        setReportData(data);
      }
    } catch (error) {
      message.error('Lỗi tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    const reportName = reportTypes.find(t => t.value === reportType)?.label || 'Báo cáo';
    let exportData = [];

    switch (reportType) {
      case 'inventory':
        exportData = reportData.map((item, index) => ({
          'STT': index + 1,
          'Mã SP': item.Product?.SKU || '',
          'Tên sản phẩm': item.Product?.Name || '',
          'Đơn vị': item.Product?.Unit || '',
          'Tồn kho': item.Quantity || 0,
          'Vị trí': item.Product?.Location || ''
        }));
        break;
      case 'transactions':
        exportData = reportData.map((item, index) => {
          // Tạo mã GD giống như trên bảng
          const id = item.TransactionID || item.transaction_i_d;
          const date = item.CreatedAt || item.created_at;
          const quantity = item.Quantity || item.quantity || 0;
          const type = quantity > 0 ? 'NK' : 'XK';
          
          let transactionCode = '-';
          if (id && date) {
            const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
            transactionCode = `${type}${dateStr}${String(id).padStart(4, '0')}`;
          } else if (id) {
            transactionCode = `${type}${String(id).padStart(6, '0')}`;
          }
          
          return {
            'STT': index + 1,
            'Mã GD': transactionCode,
            'Loại': quantity > 0 ? 'Nhập' : 'Xuất',
            'Sản phẩm': item.Product?.Name || item.Product?.name || '',
            'Số lượng': Math.abs(quantity),
            'Đơn giá': item.UnitPrice || item.unit_price || 0,
            'Ngày': date ? new Date(date).toLocaleDateString('vi-VN') : '-'
          };
        });
        break;
      default:
        exportData = reportData.map((item, index) => ({
          'STT': index + 1,
          'Mã SP': item.Product?.SKU || '',
          'Tên sản phẩm': item.Product?.Name || '',
          'Tồn kho': item.Quantity || 0
        }));
    }

    // Tạo CSV
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

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`Đã xuất ${reportData.length} bản ghi ra file Excel`);
  };

  const getColumns = () => {
    switch (reportType) {
      case 'inventory': return inventoryColumns;
      case 'transactions': return transactionColumns;
      case 'lowstock': return lowStockColumns;
      case 'expiring': return expiringColumns;
      default: return inventoryColumns;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Báo cáo</h2>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng giá trị kho"
              value={stats.totalValue || 0}
              prefix={<RiseOutlined />}
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm sắp hết"
              value={stats.lowStockCount}
              prefix={<WarningOutlined />}
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

      {/* Bộ lọc báo cáo */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              value={reportType}
              onChange={(value) => {
                setReportType(value);
                setReportData([]); // Xóa dữ liệu cũ trước khi tải mới
              }}
              style={{ width: '100%' }}
              placeholder="Chọn loại báo cáo"
            >
              {reportTypes.map(type => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
          </Col>
          <Col span={10}>
            <Space>
              <Button type="primary" onClick={generateReport} loading={loading}>
                Tạo báo cáo
              </Button>
              <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
                Xuất Excel
              </Button>
              <Button icon={<FilePdfOutlined />} disabled>
                Xuất PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bảng dữ liệu báo cáo */}
      <Card>
        <Table
          columns={getColumns()}
          dataSource={reportData}
          loading={loading}
          rowKey={(record) => record.ProductID || record.TransactionID || record.id}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1000 }}
          title={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {reportTypes.find(t => t.value === reportType)?.label}
              </span>
              <span style={{ color: '#666' }}>
                Tổng cộng: {reportData.length} bản ghi
              </span>
            </div>
          )}
        />
      </Card>
    </div>
  );
};

export default ReportList;