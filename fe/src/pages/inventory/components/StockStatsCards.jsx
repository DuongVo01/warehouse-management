import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { InboxOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';

const StockStatsCards = ({ stats }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            prefix={<InboxOutlined />}
          />
        </Card>
      </Col>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Tổng số lượng"
            value={stats.totalQuantity}
            prefix={<InboxOutlined />}
          />
        </Card>
      </Col>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Sản phẩm sắp hết"
            value={stats.lowStockCount}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Sản phẩm sắp hết hạn"
            value={stats.expiringCount}
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Sản phẩm đã hết hạn"
            value={stats.expiredCount || 0}
            prefix={<WarningOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StockStatsCards;