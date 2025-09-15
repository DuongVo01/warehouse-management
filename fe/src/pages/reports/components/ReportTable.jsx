import React from 'react';
import { Card, Table } from 'antd';

const ReportTable = ({ columns, reportData, loading, reportTypes, reportType }) => {
  return (
    <Card>
      <Table
        columns={columns}
        dataSource={reportData}
        loading={loading}
        rowKey={(record) => record.ProductID || record.TransactionID || record.id}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1000 }}
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {reportTypes.find(t => t.value === reportType)?.label}
            </span>
            <span style={{ color: '#666' }}>
              Tổng cộng: {reportData.length} bản ghi
            </span>
          </div>
        )}
      />
    </Card>
  );
};

export default ReportTable;