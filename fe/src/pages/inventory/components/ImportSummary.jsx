import React from 'react';
import { Button, Space } from 'antd';
import { calculateTotal } from '../utils/inventoryHelpers';

const ImportSummary = ({ items, loading, onCancel }) => {
  const total = calculateTotal(items);

  return (
    <div style={{ 
      textAlign: 'right', 
      marginTop: '16px', 
      padding: '16px', 
      background: '#f5f5f5', 
      borderRadius: '8px' 
    }}>
      <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
        Tổng tiền: {total.toLocaleString()} đ
      </div>
      <Space>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu phiếu nhập
        </Button>
        <Button onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
      </Space>
    </div>
  );
};

export default ImportSummary;