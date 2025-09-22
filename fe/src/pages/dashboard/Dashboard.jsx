import React from 'react';
import { Row, Col } from 'antd';
import { useDashboardData } from './hooks/useDashboardData';
import StatsCards from './components/StatsCards';
import TransactionChart from './components/TransactionChart';
import InventoryTrendChart from './components/InventoryTrendChart';

const Dashboard = () => {
  const { stats, dailyTransactions, inventoryTrend, loading } = useDashboardData();

  return (
    <div>
      <div className="page-header">
        <h2>Tổng quan</h2>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <TransactionChart data={dailyTransactions} loading={loading} />
        </Col>
        <Col span={12}>
          <InventoryTrendChart data={inventoryTrend} loading={loading} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;