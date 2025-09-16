import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser?.role || currentUser?.Role;

  if (!allowedRoles.includes(userRole)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này."
        extra={<Button type="primary" onClick={() => window.history.back()}>Quay lại</Button>}
      />
    );
  }

  return children;
};

export default ProtectedRoute;