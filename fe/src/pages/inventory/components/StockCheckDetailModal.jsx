import React from 'react';
import { Modal, Button, Avatar, Row, Col, Card, Tag, Divider, Typography, Space } from 'antd';
import { PictureOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StockCheckDetailModal = ({ visible, onClose, stockCheck }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approved':
        return { color: 'green', icon: <CheckCircleOutlined /> };
      case 'Rejected':
        return { color: 'red', icon: <CloseCircleOutlined /> };
      case 'Pending':
      default:
        return { color: 'orange', icon: <ClockCircleOutlined /> };
    }
  };

  const statusConfig = stockCheck ? getStatusConfig(stockCheck.status) : {};

  if (!stockCheck) {
    return (
      <Modal
        title="Chi tiết phiếu kiểm kê"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>
        ]}
      >
        <p>Không có dữ liệu.</p>
      </Modal>
    );
  }

  const difference = (stockCheck.actualQuantity || 0) - (stockCheck.systemQuantity || 0);
  const diffColor = difference > 0 ? 'green' : difference < 0 ? 'red' : 'blue';

  return (
    <Modal
      title={
        <Space align="center">
          <Title level={4} style={{ margin: 0 }}>Chi tiết phiếu kiểm kê</Title>
          <Tag color={statusConfig.color}>
            {statusConfig.icon} {getStatusText(stockCheck.status)}
          </Tag>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản */}
        <Col span={24}>
          <Card title="Thông tin kiểm kê" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Mã kiểm kê:</Text>
                <br />
                <Text>{stockCheck.checkId}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Ngày tạo:</Text>
                <br />
                <Text>{new Date(stockCheck.createdAt).toLocaleString('vi-VN')}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Người tạo:</Text>
                <br />
                <Text><UserOutlined /> {stockCheck.createdBy?.fullName || 'N/A'}</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col span={24}>
          <Card title="Thông tin sản phẩm" size="small">
            <Row align="middle" gutter={16}>
              <Col span={6}>
                <Avatar
                  src={stockCheck.productId?.image ? `http://localhost:5000${stockCheck.productId.image}` : null}
                  icon={<PictureOutlined />}
                  size={64}
                  shape="square"
                  style={{ width: 80, height: 80 }}
                />
              </Col>
              <Col span={18}>
                <Title level={5} style={{ margin: 0 }}>{stockCheck.productId?.sku}</Title>
                <Text>{stockCheck.productId?.name}</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Số lượng và chênh lệch */}
        <Col span={24}>
          <Card title="Số lượng" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  <Text type="secondary">Hệ thống</Text>
                  <Title level={3} style={{ margin: 0 }}>{stockCheck.systemQuantity}</Title>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center', padding: '20px', border: '1px solid #d9d9d9', borderRadius: 8 }}>
                  <Text type="secondary">Thực tế</Text>
                  <Title level={3} style={{ margin: 0 }}>{stockCheck.actualQuantity}</Title>
                </Space>
              </Col>
            </Row>
            <Divider />
            <Row justify="center">
              <Col>
                <Text strong style={{ color: diffColor }}>Chênh lệch: {difference > 0 ? '+' : ''}{difference}</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ghi chú */}
        {stockCheck.note && (
          <Col span={24}>
            <Card title="Ghi chú" size="small">
              <Text>{stockCheck.note}</Text>
            </Card>
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default StockCheckDetailModal;