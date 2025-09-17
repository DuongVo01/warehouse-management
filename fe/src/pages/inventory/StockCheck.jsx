import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Modal, Form, Input, InputNumber, Select, Row, Col, Card, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { inventoryAPI } from '../../services/api/inventoryAPI';
import { productAPI } from '../../services/api/productAPI';
import { authAPI } from '../../services/api/authAPI';

const StockCheck = () => {
  const [stockChecks, setStockChecks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [currentStock, setCurrentStock] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [form] = Form.useForm();

  const columns = [
    { title: 'Mã kiểm kê', dataIndex: 'checkId', key: 'checkId' },
    { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
    { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'productName' },
    { title: 'Số lượng hệ thống', dataIndex: 'systemQuantity', key: 'systemQuantity' },
    { title: 'Số lượng thực tế', dataIndex: 'actualQuantity', key: 'actualQuantity' },
    { 
      title: 'Chênh lệch', 
      key: 'difference',
      render: (_, record) => {
        const diff = (record.actualQuantity || 0) - (record.systemQuantity || 0);
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
      dataIndex: 'status', 
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
    { title: 'Người tạo', dataIndex: ['createdBy', 'fullName'], key: 'creator' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => viewDetail(record)}>
            Xem
          </Button>
          {record.status === 'Pending' && userRole === 'Admin' && (
            <>
              <Button icon={<CheckOutlined />} size="small" type="primary" onClick={() => approveCheck(record._id)}>
                Duyệt
              </Button>
              <Button icon={<CloseOutlined />} size="small" danger onClick={() => rejectCheck(record._id)}>
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
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setUserRole(response.data.data.role);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

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
        setProducts(response.data.data.filter(p => p.isActive !== false));
      }
    } catch (error) {
      message.error('Lỗi tải danh sách sản phẩm');
    }
  };

  const handleProductChange = async (productId) => {
    try {
      const response = await inventoryAPI.getBalance({ productId });
      if (response.data.success) {
        const balance = response.data.data.find(b => b.productId._id === productId);
        setCurrentStock(balance ? balance.quantity : 0);
      }
    } catch (error) {
      console.error('Error loading stock:', error);
      setCurrentStock(0);
    }
  };

  const handleCreateCheck = async (values) => {
    try {
      const checkData = {
        productId: values.productId,
        actualQuantity: values.actualQuantity,
        note: values.note
      };
      
      const response = await inventoryAPI.createStockCheck(checkData);
      
      message.success('Tạo phiếu kiểm kê thành công');
      setModalVisible(false);
      form.resetFields();
      setCurrentStock(0);
      loadStockChecks();
    } catch (error) {
      console.error('Stock check creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi tạo phiếu kiểm kê';
      message.error(errorMessage);
    }
  };

  const approveCheck = async (checkId) => {
    try {
      const response = await inventoryAPI.approveStockCheck(checkId);
      console.log('Approve response:', response);
      
      if (response.data.success) {
        message.success('Duyệt phiếu kiểm kê thành công');
        loadStockChecks();
      } else {
        message.error(response.data.message || 'Lỗi duyệt phiếu kiểm kê');
      }
    } catch (error) {
      console.error('Approve error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi duyệt phiếu kiểm kê';
      message.error(errorMessage);
      // Vẫn tải lại danh sách để cập nhật trạng thái
      loadStockChecks();
    }
  };

  const rejectCheck = (checkId) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: 'Bạn có chắc chắn muốn từ chối phiếu kiểm kê này?',
      onOk: async () => {
        try {
          await inventoryAPI.rejectStockCheck(checkId);
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
    pending: stockChecks.filter(c => c.status === 'Pending').length,
    approved: stockChecks.filter(c => c.status === 'Approved').length,
    rejected: stockChecks.filter(c => c.status === 'Rejected').length
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
        rowKey="_id"
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
            <Select 
              placeholder="Chọn sản phẩm" 
              showSearch
              onChange={handleProductChange}
            >
              {products.map(product => (
                <Select.Option key={product._id} value={product._id}>
                  {product.sku} - {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số lượng hệ thống">
                <InputNumber value={currentStock} disabled style={{ width: '100%' }} />
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
              <Button onClick={() => { 
                setModalVisible(false); 
                form.resetFields(); 
                setCurrentStock(0);
              }}>
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
            <p><strong>Mã kiểm kê:</strong> {selectedCheck.checkId}</p>
            <p><strong>Sản phẩm:</strong> {selectedCheck.productId?.sku} - {selectedCheck.productId?.name}</p>
            <p><strong>Số lượng hệ thống:</strong> {selectedCheck.systemQuantity}</p>
            <p><strong>Số lượng thực tế:</strong> {selectedCheck.actualQuantity}</p>
            <p><strong>Chênh lệch:</strong> {(selectedCheck.actualQuantity || 0) - (selectedCheck.systemQuantity || 0)}</p>
            <p><strong>Trạng thái:</strong> {
              selectedCheck.status === 'Pending' ? 'Chờ duyệt' :
              selectedCheck.status === 'Approved' ? 'Đã duyệt' :
              selectedCheck.status === 'Rejected' ? 'Từ chối' :
              selectedCheck.status
            }</p>
            <p><strong>Người tạo:</strong> {selectedCheck.createdBy?.fullName}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedCheck.createdAt).toLocaleString('vi-VN')}</p>
            {selectedCheck.note && <p><strong>Ghi chú:</strong> {selectedCheck.note}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StockCheck;