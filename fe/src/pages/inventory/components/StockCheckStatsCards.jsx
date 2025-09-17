import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';

const StockCheckStatsCards = ({ stockChecks }) => {
  const stats = {
    total: stockChecks.length,
    pending: stockChecks.filter(c => c.status === 'Pending').length,
    approved: stockChecks.filter(c => c.status === 'Approved').length,
    rejected: stockChecks.filter(c => c.status === 'Rejected').length
  };

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng số phiếu" value={stats.total} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Chờ duyệt" value={stats.pending} valueStyle={{ color: '#fa8c16' }} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Đã duyệt" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
        </Card>
      </Col>
    </Row>
  );
};

export default StockCheckStatsCards;