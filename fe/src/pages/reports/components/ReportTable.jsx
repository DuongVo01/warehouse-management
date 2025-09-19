import React, { useState, useCallback } from 'react';
import { Card, Table } from 'antd';
import styles from './ReportTable.module.css';

const ReportTable = ({ columns, reportData, loading, reportTypes, reportType }) => {
  // Đảm bảo reportData luôn là array
  const safeReportData = Array.isArray(reportData) ? reportData : [];
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `${range[0]}-${range[1]} của ${total} bản ghi`,
    pageSizeOptions: ['10', '20', '50', '100']
  });

  const handleTableChange = useCallback((paginationConfig) => {
    setPagination(prev => {
      // Nếu chỉ thay đổi pageSize, tính toán lại current page
      if (paginationConfig.pageSize !== prev.pageSize) {
        // Tính item đầu tiên của trang hiện tại
        const currentFirstItem = (prev.current - 1) * prev.pageSize + 1;
        // Tính trang mới dựa trên pageSize mới
        const newCurrent = Math.ceil(currentFirstItem / paginationConfig.pageSize);
        
        return {
          ...prev,
          current: newCurrent,
          pageSize: paginationConfig.pageSize
        };
      }
      
      // Nếu chỉ thay đổi trang
      return {
        ...prev,
        current: paginationConfig.current,
        pageSize: paginationConfig.pageSize
      };
    });
  }, []);

  // Cấu hình locale cho pagination
  const locale = {
    items_per_page: '/ trang',
    jump_to: 'Đến trang',
    jump_to_confirm: 'xác nhận',
    page: '',
    prev_page: 'Trang trước',
    next_page: 'Trang sau',
    prev_5: '5 trang trước',
    next_5: '5 trang sau',
    prev_3: '3 trang trước',
    next_3: '3 trang sau'
  };
  
  return (
    <Card>
      <div className={styles.reportTable}>
        <Table
          columns={columns}
          dataSource={safeReportData}
          loading={loading}
          rowKey={(record) => record._id || record.id || Math.random()}
          pagination={pagination}
          onChange={handleTableChange}
          locale={locale}
          scroll={{ x: 1000 }}
          title={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {reportTypes.find(t => t.value === reportType)?.label}
              </span>
              <span style={{ color: '#666' }}>
                Tổng cộng: {safeReportData.length} bản ghi
              </span>
            </div>
          )}
        />
      </div>
    </Card>
  );
};

export default ReportTable;