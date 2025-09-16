import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { USER_ROLES } from '../utils/constants';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'Username',
      key: 'Username',
      render: (username) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {username}
        </span>
      )
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'FullName'
    },
    {
      title: 'Vai trò',
      dataIndex: 'Role',
      key: 'Role',
      render: (role) => {
        const roleInfo = USER_ROLES.find(r => r.value === role);
        return (
          <Tag color={roleInfo?.color}>
            {roleInfo?.label}
          </Tag>
        );
      }
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
      title: 'Số điện thoại',
      dataIndex: 'Phone',
      key: 'Phone',
      render: (phone) => phone ? (
        <span>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {phone}
        </span>
      ) : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm khóa'}
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
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => onDelete(record.UserID)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              disabled={record.UserID === 1}
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
      dataSource={users}
      loading={loading}
      rowKey="UserID"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default UserTable;