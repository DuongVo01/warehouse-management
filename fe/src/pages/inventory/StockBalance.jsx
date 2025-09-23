import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { useStockBalance } from './hooks/useStockBalance';
import StockStatsCards from './components/StockStatsCards';
import StockTable from './components/StockTable';
import { exportStockData } from './utils/stockExport';

const StockBalance = () => {
  const {
    stockData,
    loading,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    stats,
    loadStockBalance
  } = useStockBalance();

  return (
    <div>
      <div className="page-header">
        <h2>Tồn kho</h2>
      </div>

      <StockStatsCards stats={stats} />

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
            <Select.Option value="expired">Đã hết hạn</Select.Option>
            <Select.Option value="normal">Bình thường</Select.Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={loadStockBalance}>
            Làm mới
          </Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={() => exportStockData(stockData)}>
            Xuất Excel
          </Button>
        </Space>
      </div>

      <StockTable data={stockData} loading={loading} />
    </div>
  );
};

export default StockBalance;