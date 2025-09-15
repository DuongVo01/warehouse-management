import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import { ShoppingOutlined, InboxOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, lowStockRes, expiringRes] = await Promise.all([
        inventoryAPI.getStats(),
        inventoryAPI.getLowStock(),
        inventoryAPI.getExpiring()
      ]);
      setStats(statsRes.data?.data || {});
      setLowStockProducts(Array.isArray(lowStockRes.data?.data) ? lowStockRes.data.data : []);
      setExpiringProducts(Array.isArray(expiringRes.data?.data) ? expiringRes.data.data : []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats({});
      setLowStockProducts([]);
      setExpiringProducts([]);
    }
  };

  const lowStockColumns = [
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' }
  ];

  const expiringColumns = [
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Hạn sử dụng', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' }
  ];

  return (
    <div>
      <h2>Tổng quan kho hàng</h2>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng tồn kho"
              value={stats.totalStock || 0}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm sắp hết"
              value={stats.lowStockCount || 0}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm sắp hết hạn"
              value={stats.expiringCount || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Sản phẩm sắp hết hàng" size="small">
            <Table
              columns={lowStockColumns}
              dataSource={Array.isArray(lowStockProducts) ? lowStockProducts : []}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sản phẩm sắp hết hạn" size="small">
            <Table
              columns={expiringColumns}
              dataSource={Array.isArray(expiringProducts) ? expiringProducts : []}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;