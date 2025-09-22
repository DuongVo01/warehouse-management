import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  InboxOutlined, 
  DollarOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { inventoryAPI } from '../../services/api/inventoryAPI';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [inventoryTrend, setInventoryTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadChartData();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const [transactionsRes, trendRes] = await Promise.all([
        inventoryAPI.getDailyTransactions({ days: 30 }),
        inventoryAPI.getInventoryTrend({ days: 30 })
      ]);
      
      if (transactionsRes.data.success) {
        setDailyTransactions(transactionsRes.data.data);
      }
      
      if (trendRes.data.success) {
        setInventoryTrend(trendRes.data.data);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Tổng quan</h2>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng giá trị kho"
              value={stats.totalValue || 0}
              prefix={<DollarOutlined />}
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Sản phẩm sắp hết"
              value={stats.lowStockCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Sản phẩm sắp hết hạn"
              value={stats.expiringCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Giao dịch hàng ngày (30 ngày gần đây)" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTransactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                  formatter={(value, name) => [value, name === 'import' ? 'Nhập kho' : 'Xuất kho']}
                />
                <Legend 
                  formatter={(value) => value === 'import' ? 'Nhập kho' : 'Xuất kho'}
                />
                <Bar dataKey="import" fill="#52c41a" name="import" />
                <Bar dataKey="export" fill="#ff4d4f" name="export" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Giá trị tồn kho theo ngày" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                  formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Giá trị tồn kho']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ fill: '#1890ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;