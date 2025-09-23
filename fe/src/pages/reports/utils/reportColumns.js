import { Tag, Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

export const inventoryColumns = [
  {
    title: 'Hình ảnh',
    dataIndex: ['productId', 'image'],
    key: 'image',
    width: 60,
    render: (image) => (
      <Avatar 
        src={image ? `http://localhost:5000${image}` : null} 
        icon={<PictureOutlined />}
        size={32}
        shape="square"
      />
    )
  },
  { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'name' },
  { title: 'Đơn vị', dataIndex: ['productId', 'unit'], key: 'unit' },
  { 
    title: 'Tồn kho', 
    dataIndex: 'quantity', 
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
  { title: 'Vị trí', dataIndex: ['productId', 'location'], key: 'location' },
  { title: 'Ngày báo cáo', key: 'reportDate',
    render: () => new Date().toLocaleDateString('vi-VN')
  },
  { 
    title: 'Trạng thái', 
    key: 'status',
    render: (_, record) => {
      const quantity = record.quantity;
      const expiryDate = record.productId?.expiryDate;
      
      if (quantity <= 10) {
        return <Tag color="red">Sắp hết</Tag>;
      }
      if (quantity <= 50) {
        return <Tag color="orange">Sắp cạn kiệt</Tag>;
      }
      if (expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30*24*60*60*1000)) {
        return <Tag color="volcano">Sắp hết hạn</Tag>;
      }
      return <Tag color="green">Bình thường</Tag>;
    }
  }
];

export const transactionColumns = [
  { title: 'Mã GD', key: 'id', 
    render: (_, record) => {
      const id = record._id;
      const date = record.createdAt;
      const type = record.transactionType === 'Import' ? 'NK' : 'XK';
      
      if (id && date) {
        const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
        return `${type}${dateStr}${String(id).slice(-4)}`;
      }
      return id ? `${type}${String(id).slice(-6)}` : '-';
    }
  },
  { title: 'Loại', key: 'type', 
    render: (_, record) => {
      const type = record.transactionType;
      return (
        <Tag color={type === 'Import' ? 'green' : 'red'}>
          {type === 'Import' ? 'Nhập' : 'Xuất'}
        </Tag>
      );
    }
  },
  {
    title: 'Hình ảnh',
    dataIndex: ['productId', 'image'],
    key: 'image',
    width: 60,
    render: (image) => (
      <Avatar 
        src={image ? `http://localhost:5000${image}` : null} 
        icon={<PictureOutlined />}
        size={32}
        shape="square"
      />
    )
  },
  { title: 'Sản phẩm', key: 'product',
    render: (_, record) => `${record.productId?.sku} - ${record.productId?.name}` || '-'
  },
  { title: 'Số lượng', key: 'quantity',
    render: (_, record) => {
      const quantity = record.quantity || 0;
      return Math.abs(quantity);
    }
  },
  { title: 'Đơn giá', key: 'price', 
    render: (_, record) => {
      // Nhập kho: hiển thị unitPrice (giá nhập)
      // Xuất kho: hiển thị salePrice (giá bán)
      const price = record.transactionType === 'Import' 
        ? record.unitPrice 
        : record.productId?.salePrice;
      return price ? `${price.toLocaleString()} đ` : '-';
    }
  },
  { title: 'Ngày', key: 'date',
    render: (_, record) => {
      const date = record.createdAt;
      return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
    }
  },
  { title: 'Người thực hiện', key: 'createdBy',
    render: (_, record) => {
      const user = record.createdBy;
      return user ? `${user.fullName} (${user.employeeCode || 'N/A'})` : '-';
    }
  },
  { title: 'Ghi chú', key: 'note',
    render: (_, record) => record.note || record.customerInfo || '-'
  }
];

export const lowStockColumns = [
  {
    title: 'Hình ảnh',
    dataIndex: ['productId', 'image'],
    key: 'image',
    width: 60,
    render: (image) => (
      <Avatar 
        src={image ? `http://localhost:5000${image}` : null} 
        icon={<PictureOutlined />}
        size={32}
        shape="square"
      />
    )
  },
  { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'name' },
  { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity',
    render: (value) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{value}</span>
  },
  { title: 'Vị trí', dataIndex: ['productId', 'location'], key: 'location' }
];

export const expiringColumns = [
  {
    title: 'Hình ảnh',
    dataIndex: ['productId', 'image'],
    key: 'image',
    width: 60,
    render: (image) => (
      <Avatar 
        src={image ? `http://localhost:5000${image}` : null} 
        icon={<PictureOutlined />}
        size={32}
        shape="square"
      />
    )
  },
  { title: 'Mã SP', dataIndex: ['productId', 'sku'], key: 'sku' },
  { title: 'Tên sản phẩm', dataIndex: ['productId', 'name'], key: 'name' },
  { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Hạn sử dụng', dataIndex: ['productId', 'expiryDate'], key: 'expiry',
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