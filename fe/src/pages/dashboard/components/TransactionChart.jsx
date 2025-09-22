import React from 'react';
import { Card } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const TransactionChart = ({ data, loading }) => {
  return (
    <Card title="Giao dịch hàng ngày (30 ngày gần đây)" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
            formatter={(value, name) => [value, name === 'import' ? 'Nhập kho' : 'Xuất kho']}
          />
          <Legend 
            formatter={(value) => value === 'import' ? 'Nhập kho' : 'Xuất kho'}
          />
          <Bar dataKey="import" fill="#52c41a" name="import" />
          <Bar dataKey="export" fill="#ff4d4f" name="export" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TransactionChart;