import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Input, message, Modal, Form, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { productAPI } from '../../services/api/productAPI';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  console.log('ProductList render - products:', products, 'type:', typeof products, 'isArray:', Array.isArray(products));

  const columns = [
    { title: 'Mã SP', dataIndex: 'SKU', key: 'SKU' },
    { title: 'Tên sản phẩm', dataIndex: 'Name', key: 'Name' },
    { title: 'Đơn vị', dataIndex: 'Unit', key: 'Unit' },
    { title: 'Giá nhập', dataIndex: 'CostPrice', key: 'CostPrice', render: (value) => `${value?.toLocaleString()} đ` },
    { title: 'Giá bán', dataIndex: 'SalePrice', key: 'SalePrice', render: (value) => `${value?.toLocaleString()} đ` },
    { title: 'Vị trí', dataIndex: 'Location', key: 'Location' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  // Debounce search
  useEffect(() => {
    console.log('Search text changed:', searchText);
    const timer = setTimeout(() => {
      if (searchText.trim()) {
        console.log('Searching for:', searchText.trim());
        searchProducts(searchText.trim());
      } else {
        console.log('Loading all products');
        loadProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const loadProducts = async (searchParams = {}) => {
    setLoading(true);
    try {
      const params = { limit: 100, ...searchParams };
      console.log('API call with params:', params);
      const response = await productAPI.getProducts(params);
      console.log('API response:', response.data);
      if (response.data.success) {
        // Chỉ hiển thị sản phẩm đang hoạt động
        const activeProducts = response.data.data.filter(product => product.IsActive !== false);
        setProducts(Array.isArray(activeProducts) ? activeProducts : []);
      } else {
        setProducts([]);
        message.error(response.data.message || 'Không thể tải dữ liệu sản phẩm');
      }
    } catch (error) {
      console.error('Load products error:', error);
      setProducts([]);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi tải dữ liệu: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = useCallback((searchValue) => {
    console.log('searchProducts called with:', searchValue);
    const searchParams = {};
    if (searchValue) {
      // Tìm kiếm theo cả tên và SKU
      searchParams.search = searchValue;
    }
    console.log('Search params:', searchParams);
    loadProducts(searchParams);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      sku: product.SKU,
      name: product.Name,
      unit: product.Unit,
      costPrice: product.CostPrice,
      salePrice: product.SalePrice,
      expiryDate: product.ExpiryDate ? dayjs(product.ExpiryDate) : null,
      location: product.Location
    });
    setIsModalVisible(true);
  };

  const handleDelete = (product) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn vô hiệu hóa sản phẩm "${product.Name}"? Sản phẩm sẽ không hiển thị trong danh sách nhưng dữ liệu vẫn được bảo tồn.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          console.log('Deleting product with ID:', product.ProductID);
          const response = await productAPI.deleteProduct(product.ProductID);
          console.log('Delete response:', response.data);
          
          if (response.data.success) {
            message.success('Xóa sản phẩm thành công');
            loadProducts();
          } else {
            message.error(response.data.message || 'Lỗi xóa sản phẩm');
          }
        } catch (error) {
          console.error('Delete product error:', error);
          if (error.response?.status === 401) {
            message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
          } else if (error.response?.status === 404) {
            message.error('Không tìm thấy sản phẩm');
          } else {
            message.error(`Lỗi xóa sản phẩm: ${error.response?.data?.message || error.message}`);
          }
        }
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const productData = {
        sku: values.sku,
        name: values.name,
        unit: values.unit,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
        location: values.location
      };

      let response;
      if (editingProduct) {
        response = await productAPI.updateProduct(editingProduct.ProductID, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        response = await productAPI.createProduct(productData);
        message.success('Thêm sản phẩm thành công');
      }
      
      if (response.data.success) {
        setIsModalVisible(false);
        form.resetFields();
        setEditingProduct(null);
        loadProducts();
      } else {
        message.error(response.data.message || 'Lỗi xử lý sản phẩm');
      }
    } catch (error) {
      console.error('Product operation error:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(`Lỗi xử lý sản phẩm: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
      </div>
      
      <div className="action-buttons">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
            Thêm sản phẩm
          </Button>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(products) ? products : []}
        loading={loading}
        rowKey="ProductID"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProduct ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="sku" label="Mã sản phẩm" rules={[{ required: true }]}>
            <Input placeholder="Nhập mã sản phẩm" disabled={!!editingProduct} />
          </Form.Item>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
            <Input placeholder="Nhập đơn vị (cái, kg, lít...)" />
          </Form.Item>
          <Form.Item name="costPrice" label="Giá nhập" rules={[{ required: true }]}>
            <InputNumber placeholder="Nhập giá nhập" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="salePrice" label="Giá bán" rules={[{ required: true }]}>
            <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiryDate" label="Ngày hết hạn">
            <DatePicker placeholder="Chọn ngày hết hạn" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="Vị trí">
            <Input placeholder="Nhập vị trí lưu trữ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;