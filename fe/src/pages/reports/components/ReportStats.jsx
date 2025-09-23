import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BarChartOutlined, RiseOutlined, WarningOutlined } from '@ant-design/icons';

const ReportStats = ({ stats }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            prefix={<BarChartOutlined />}
          />
        </Card>
      </Col>
      <Col span={4.8}>
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
      <Col span={4.8}>
        <Card>
          <Statistic
            title="Sản phẩm sắp hết"
            value={stats.lowStockCount}
            prefix={<WarningOutlined />}
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

export default ReportStats;