import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  InboxOutlined, 
  DollarOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined 
} from '@ant-design/icons';

const StatsCards = ({ stats, loading }) => {
  return (
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
  );
};

export default StatsCards;