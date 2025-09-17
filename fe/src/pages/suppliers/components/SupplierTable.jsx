import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const SupplierTable = ({ suppliers, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã NCC',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 100
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone ? (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {phone}
        </span>
      ) : '-'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email ? (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </span>
      ) : '-'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      )
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
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
            onConfirm={() => onDelete(record._id)}
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

  return (
    <Table
      columns={columns}
      dataSource={suppliers}
      loading={loading}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default SupplierTable;