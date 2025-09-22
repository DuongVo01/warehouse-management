import React from 'react';
import { Modal, Button, Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const StockCheckDetailModal = ({ visible, onClose, stockCheck }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã duyệt';
      case 'Rejected': return 'Từ chối';
      default: return status;
    }
  };

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
      {stockCheck && (
        <div>
          <p><strong>Mã kiểm kê:</strong> {stockCheck.checkId}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <strong>Sản phẩm:</strong>
            <Avatar 
              src={stockCheck.productId?.image ? `http://localhost:5000${stockCheck.productId.image}` : null} 
              icon={<PictureOutlined />}
              size={32}
              shape="square"
            />
            <span>{stockCheck.productId?.sku} - {stockCheck.productId?.name}</span>
          </div>
          <p><strong>Số lượng hệ thống:</strong> {stockCheck.systemQuantity}</p>
          <p><strong>Số lượng thực tế:</strong> {stockCheck.actualQuantity}</p>
          <p><strong>Chênh lệch:</strong> {(stockCheck.actualQuantity || 0) - (stockCheck.systemQuantity || 0)}</p>
          <p><strong>Trạng thái:</strong> {getStatusText(stockCheck.status)}</p>
          <p><strong>Người tạo:</strong> {stockCheck.createdBy?.fullName}</p>
          <p><strong>Ngày tạo:</strong> {new Date(stockCheck.createdAt).toLocaleString('vi-VN')}</p>
          {stockCheck.note && <p><strong>Ghi chú:</strong> {stockCheck.note}</p>}
        </div>
      )}
    </Modal>
  );
};

export default StockCheckDetailModal;