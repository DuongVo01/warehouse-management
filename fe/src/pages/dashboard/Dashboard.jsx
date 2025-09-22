import React from 'react';
import { Row, Col } from 'antd';
import { useDashboardData } from './hooks/useDashboardData';
import StatsCards from './components/StatsCards';
import TransactionChart from './components/TransactionChart';
import InventoryTrendChart from './components/InventoryTrendChart';
import RecentTransactions from './components/RecentTransactions';
import AlertsTable from './components/AlertsTable';

const Dashboard = () => {
  const { stats, dailyTransactions, inventoryTrend, recentTransactions, lowStockItems, expiringItems, loading } = useDashboardData();

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

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <RecentTransactions transactions={recentTransactions} loading={loading} />
        </Col>
        <Col span={12}>
          <AlertsTable 
            lowStockItems={lowStockItems} 
            expiringItems={expiringItems} 
            loading={loading} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;