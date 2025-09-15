import React from 'react';
import { Card, Row, Col, DatePicker, Button, Select, Space } from 'antd';
import { FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ReportFilters = ({ 
  reportType, 
  setReportType, 
  dateRange, 
  setDateRange, 
  reportTypes, 
  onGenerateReport, 
  onExportExcel,
  onExportPDF, 
  loading,
  setReportData 
}) => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={16} align="middle">
        <Col span={6}>
          <Select
            value={reportType}
            onChange={(value) => {
              setReportType(value);
              setReportData([]);
            }}
            style={{ width: '100%' }}
            placeholder="Chọn loại báo cáo"
          >
            {reportTypes.map(type => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: '100%' }}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          />
        </Col>
        <Col span={10}>
          <Space>
            <Button type="primary" onClick={onGenerateReport} loading={loading}>
              Tạo báo cáo
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={onExportExcel}>
              Xuất Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={onExportPDF}>
              Xuất PDF
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default ReportFilters;