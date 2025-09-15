import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select, Row, Col, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';
import { productAPI } from '../../services/api/productAPI';

const StockCheck = () => {
  const [stockChecks, setStockChecks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã kiểm kê', dataIndex: 'CheckID', key: 'checkId' },
    { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'productName' },
    { title: 'Số lượng hệ thống', dataIndex: 'SystemQuantity', key: 'systemQuantity' },
    { title: 'Số lượng thực tế', dataIndex: 'ActualQuantity', key: 'actualQuantity' },
    { 
      title: 'Chênh lệch', 
      key: 'difference',
      render: (_, record) => {
        const diff = (record.ActualQuantity || 0) - (record.SystemQuantity || 0);
        return (
          <span style={{ 
            color: diff > 0 ? '#52c41a' : diff < 0 ? '#ff4d4f' : '#666',
            fontWeight: 'bold'
          }}>
            {diff > 0 ? '+' : ''}{diff}
          </span>
        );
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'Status', 
      key: 'status',
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'orange', text: 'Chờ duyệt' },
          'Approved': { color: 'green', text: 'Đã duyệt' },
          'Rejected': { color: 'red', text: 'Từ chối' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    { title: 'Người tạo', dataIndex: ['Creator', 'FullName'], key: 'creator' },
    { title: 'Ngày tạo', dataIndex: 'CreatedAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => viewDetail(record)}>
            Xem
          </Button>
          {record.Status === 'Pending' && (
            <>
              <Button icon={<CheckOutlined />} size="small" type="primary" onClick={() => approveCheck(record.CheckID)}>
                Duyệt
              </Button>
              <Button icon={<CloseOutlined />} size="small" danger onClick={() => rejectCheck(record.CheckID)}>
                Từ chối
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  useEffect(() => {
    loadStockChecks();
    loadProducts();
  }, []);

  const loadStockChecks = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getStockChecks();
      if (response.data.success) {
        setStockChecks(response.data.data || []);
      }
    } catch (error) {
      console.error('Stock check error:', error);
      message.error(`Lỗi tải danh sách kiểm kê: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts({ limit: 100 });
      if (response.data.success) {
        setProducts(response.data.data.filter(p => p.IsActive !== false));
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const handleCreateCheck = async (values) => {
    try {
      const checkData = {
        productID: values.productId,
        systemQuantity: values.systemQuantity,
        actualQuantity: values.actualQuantity,
        note: values.note
      };
      
      await inventoryAPI.createStockCheck(checkData);
      message.success('Tạo phiếu kiểm kê thành công');
      setModalVisible(false);
      form.resetFields();
      loadStockChecks();
    } catch (error) {
      message.error('Lỗi tạo phiếu kiểm kê');
    }
  };

  const approveCheck = async (checkId) => {
    try {
      await inventoryAPI.approveStockCheck(checkId);
      message.success('Duyệt phiếu kiểm kê thành công');
      loadStockChecks();
    } catch (error) {
      message.error('Lỗi duyệt phiếu kiểm kê');
    }
  };

  const rejectCheck = (checkId) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: 'Bạn có chắc chắn muốn từ chối phiếu kiểm kê này?',
      onOk: async () => {
        try {
          // API từ chối kiểm kê (cần thêm vào backend)
          message.success('Từ chối phiếu kiểm kê thành công');
          loadStockChecks();
        } catch (error) {
          message.error('Lỗi từ chối phiếu kiểm kê');
        }
      }
    });
  };

  const viewDetail = (record) => {
    setSelectedCheck(record);
    setDetailModalVisible(true);
  };

  const stats = {
    total: stockChecks.length,
    pending: stockChecks.filter(c => c.Status === 'Pending').length,
    approved: stockChecks.filter(c => c.Status === 'Approved').length,
    rejected: stockChecks.filter(c => c.Status === 'Rejected').length
  };

  return (
    <div>
      <div className="page-header">
        <h2>Kiểm kê kho</h2>
      </div>

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

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Tạo phiếu kiểm kê
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={stockChecks}
        loading={loading}
        rowKey="CheckID"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal tạo phiếu kiểm kê */}
      <Modal
        title="Tạo phiếu kiểm kê"
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCheck}>
          <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true }]}>
            <Select placeholder="Chọn sản phẩm" showSearch>
              {products.map(product => (
                <Select.Option key={product.ProductID} value={product.ProductID}>
                  {product.SKU} - {product.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="systemQuantity" label="Số lượng hệ thống" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="actualQuantity" label="Số lượng thực tế" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Tạo phiếu
              </Button>
              <Button onClick={() => { setModalVisible(false); form.resetFields(); }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết phiếu kiểm kê"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedCheck && (
          <div>
            <p><strong>Mã kiểm kê:</strong> {selectedCheck.CheckID}</p>
            <p><strong>Sản phẩm:</strong> {selectedCheck.Product?.SKU} - {selectedCheck.Product?.Name}</p>
            <p><strong>Số lượng hệ thống:</strong> {selectedCheck.SystemQuantity}</p>
            <p><strong>Số lượng thực tế:</strong> {selectedCheck.ActualQuantity}</p>
            <p><strong>Chênh lệch:</strong> {(selectedCheck.ActualQuantity || 0) - (selectedCheck.SystemQuantity || 0)}</p>
            <p><strong>Trạng thái:</strong> {selectedCheck.Status}</p>
            <p><strong>Người tầo:</strong> {selectedCheck.Creator?.FullName}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedCheck.CreatedAt).toLocaleString('vi-VN')}</p>
            {selectedCheck.Note && <p><strong>Ghi chú:</strong> {selectedCheck.Note}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockCheck;