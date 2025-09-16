import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { supplierAPI } from '../../services/api/supplierAPI';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierAPI.getSuppliers();
      if (response.data.success) {
        setSuppliers(response.data.data || []);
      } else {
        message.error(response.data.message || 'Lỗi tải danh sách nhà cung cấp');
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải danh sách nhà cung cấp');
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã NCC',
      dataIndex: 'SupplierCode',
      key: 'SupplierCode',
      width: 100
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'TaxCode',
      key: 'TaxCode'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'Phone',
      key: 'Phone',
      render: (phone) => (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {phone}
        </span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      render: (email) => (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </span>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address',
      ellipsis: true
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
            onConfirm={() => handleDelete(record.SupplierID)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setModalVisible(true);
  };

  const handleDelete = async (supplierId, force = false) => {
    try {
      const url = force ? `${supplierId}?force=true` : supplierId;
      const response = await supplierAPI.deleteSupplier(url);
      if (response.data.success) {
        setSuppliers(suppliers.filter(s => s.SupplierID !== supplierId));
        message.success('Xóa nhà cung cấp thành công');
      } else {
        message.error(response.data.message || 'Lỗi xóa nhà cung cấp');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      if (error.response?.status === 400 && error.response?.data?.canForceDelete) {
        // Hiển thị dialog xác nhận xóa bắt buộc
        Modal.confirm({
          title: 'Xóa nhà cung cấp',
          content: `${error.response.data.message}. Bạn có muốn xóa bắt buộc (bao gồm cả các giao dịch liên quan)?`,
          okText: 'Xóa bắt buộc',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: () => handleDelete(supplierId, true)
        });
      } else if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(error.response?.data?.message || 'Lỗi xóa nhà cung cấp');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingSupplier) {
        // Cập nhật
        const response = await supplierAPI.updateSupplier(editingSupplier.SupplierID, values);
        if (response.data.success) {
          const updatedSuppliers = suppliers.map(s => 
            s.SupplierID === editingSupplier.SupplierID 
              ? { ...s, ...values }
              : s
          );
          setSuppliers(updatedSuppliers);
          message.success('Cập nhật nhà cung cấp thành công');
        } else {
          message.error(response.data.message || 'Lỗi cập nhật nhà cung cấp');
          return;
        }
      } else {
        // Thêm mới
        const response = await supplierAPI.createSupplier(values);
        if (response.data.success) {
          const newSupplier = response.data.data;
          setSuppliers([...suppliers, newSupplier]);
          message.success('Thêm nhà cung cấp thành công');
        } else {
          message.error(response.data.message || 'Lỗi thêm nhà cung cấp');
          return;
        }
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving supplier:', error);
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi lưu thông tin nhà cung cấp');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý nhà cung cấp</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm nhà cung cấp
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        loading={loading}
        rowKey="SupplierID"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSupplier ? 'Sửa thông tin nhà cung cấp' : 'Thêm nhà cung cấp mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="Name"
            label="Tên nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
          >
            <Input placeholder="Nhập tên nhà cung cấp" />
          </Form.Item>

          <Form.Item
            name="TaxCode"
            label="Mã số thuế"
          >
            <Input placeholder="Nhập mã số thuế (không bắt buộc)" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="Phone"
              label="Số điện thoại"
              rules={[
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="Email"
              label="Email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </div>

          <Form.Item
            name="Address"
            label="Địa chỉ"
            rules={[]}
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierList;