import React from 'react';
import { Card } from 'antd';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const InventoryTrendChart = ({ data, loading }) => {
  return (
    <Card title="Giá trị tồn kho theo ngày" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
          />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
            formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Giá trị tồn kho']}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#1890ff" 
            strokeWidth={2}
            dot={{ fill: '#1890ff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default InventoryTrendChart;