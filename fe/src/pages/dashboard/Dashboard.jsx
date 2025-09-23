import React from 'react';
import { Row, Col } from 'antd';
import { useDashboardData } from './hooks/useDashboardData';
import StatsCards from './components/StatsCards';
import TransactionChart from './components/TransactionChart';
import InventoryTrendChart from './components/InventoryTrendChart';
import RecentTransactions from './components/RecentTransactions';
import AlertsTable from './components/AlertsTable';

const Dashboard = () => {
  const { stats, dailyTransactions, inventoryTrend, recentTransactions, lowStockItems, expiringItems, expiredItems, loading } = useDashboardData();
  
  // Lấy thông tin user role từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser?.role;

  return (
    <div>
      <div className="page-header">
        <h2>Tổng quan</h2>
      </div>

      <StatsCards stats={stats} loading={loading} userRole={userRole} />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={userRole === 'Staff' ? 24 : 12}>
          <TransactionChart data={dailyTransactions} loading={loading} />
        </Col>
        {userRole !== 'Staff' && (
          <Col span={12}>
            <InventoryTrendChart data={inventoryTrend} loading={loading} />
          </Col>
        )}
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <RecentTransactions transactions={recentTransactions} loading={loading} />
        </Col>
        <Col span={12}>
          <AlertsTable 
            lowStockItems={lowStockItems} 
            expiringItems={expiringItems}
            expiredItems={expiredItems}
            loading={loading} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;