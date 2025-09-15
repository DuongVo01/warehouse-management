import { Tag } from 'antd';

export const inventoryColumns = [
  { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
  { title: 'Đơn vị', dataIndex: ['Product', 'Unit'], key: 'unit' },
  { 
    title: 'Tồn kho', 
    dataIndex: 'Quantity', 
    key: 'quantity',
    render: (value) => (
      <span style={{ 
        color: value <= 10 ? '#ff4d4f' : value <= 50 ? '#fa8c16' : '#52c41a',
        fontWeight: 'bold'
      }}>
        {value?.toLocaleString()}
      </span>
    )
  },
  { title: 'Vị trí', dataIndex: ['Product', 'Location'], key: 'location' },
  { title: 'Ngày báo cáo', key: 'reportDate',
    render: () => new Date().toLocaleDateString('vi-VN')
  },
  { 
    title: 'Trạng thái', 
    key: 'status',
    render: (_, record) => {
      const quantity = record.Quantity;
      if (quantity <= 10) return <Tag color="red">Sắp hết</Tag>;
      if (quantity <= 50) return <Tag color="orange">Sắp cạn kiệt</Tag>;
      return <Tag color="green">Bình thường</Tag>;
    }
  }
];

export const transactionColumns = [
  { title: 'Mã GD', key: 'id', 
    render: (_, record) => {
      const id = record.TransactionID || record.transaction_i_d;
      const date = record.CreatedAt || record.created_at;
      const quantity = record.Quantity || record.quantity || 0;
      const type = quantity > 0 ? 'NK' : 'XK';
      
      if (id && date) {
        const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
        return `${type}${dateStr}${String(id).padStart(4, '0')}`;
      }
      return id ? `${type}${String(id).padStart(6, '0')}` : '-';
    }
  },
  { title: 'Loại', key: 'type', 
    render: (_, record) => {
      const quantity = record.Quantity || record.quantity || 0;
      const actualType = quantity > 0 ? 'Import' : 'Export';
      return (
        <Tag color={actualType === 'Import' ? 'green' : 'red'}>
          {actualType === 'Import' ? 'Nhập' : 'Xuất'}
        </Tag>
      );
    }
  },
  { title: 'Sản phẩm', key: 'product',
    render: (_, record) => record.Product?.Name || record.Product?.name || '-'
  },
  { title: 'Số lượng', key: 'quantity',
    render: (_, record) => {
      const quantity = record.Quantity || record.quantity || 0;
      return Math.abs(quantity);
    }
  },
  { title: 'Đơn giá', key: 'price', 
    render: (_, record) => {
      const price = record.UnitPrice || record.unit_price;
      return price ? `${price.toLocaleString()} đ` : '-';
    }
  },
  { title: 'Ngày', key: 'date',
    render: (_, record) => {
      const date = record.CreatedAt || record.created_at;
      return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
    }
  }
];

export const lowStockColumns = [
  { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
  { title: 'Tồn kho', dataIndex: 'Quantity', key: 'quantity',
    render: (value) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{value}</span>
  },
  { title: 'Vị trí', dataIndex: ['Product', 'Location'], key: 'location' }
];

export const expiringColumns = [
  { title: 'Mã SP', dataIndex: ['Product', 'SKU'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['Product', 'Name'], key: 'name' },
  { title: 'Tồn kho', dataIndex: 'Quantity', key: 'quantity' },
  { title: 'Hạn sử dụng', dataIndex: ['Product', 'ExpiryDate'], key: 'expiry',
    render: (date) => (
      <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
        {new Date(date).toLocaleDateString('vi-VN')}
      </span>
    )
  }
];

export const getColumnsByType = (reportType) => {
  switch (reportType) {
    case 'inventory': return inventoryColumns;
    case 'transactions': return transactionColumns;
    case 'lowstock': return lowStockColumns;
    case 'expiring': return expiringColumns;
    default: return inventoryColumns;
  }
};