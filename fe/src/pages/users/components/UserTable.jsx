import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { USER_ROLES } from '../utils/constants';

const UserTable = ({ users, loading, onEdit, onDelete, currentUser }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
    pageSizeOptions: ['10', '20', '50', '100']
  });

  const handleTableChange = (paginationConfig) => {
    setPagination({
      ...pagination,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    });
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      render: (username) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {username}
        </span>
      )
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeCode',
      key: 'employeeCode'
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
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
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <span>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </span>
      )
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
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
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
      render: (_, record) => {
        const currentUserId = currentUser?.id;
        const isCurrentUser = record._id === currentUserId;
        const isFirstAdmin = false; // MongoDB không có auto-increment ID
        const shouldDisable = isFirstAdmin || isCurrentUser;
        
        console.log(`User ${record.username} (ID: ${record._id}):`, {
          isCurrentUser,
          isFirstAdmin,
          shouldDisable,
          currentUserId,
          currentUser
        });
        
        return (
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
              onConfirm={() => onDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                disabled={shouldDisable}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="_id"
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default UserTable;