import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Components
import ReportStats from './components/ReportStats';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';

// Hooks & Utils
import { useReports } from './hooks/useReports';
import { getColumnsByType } from './utils/reportColumns';
import { exportToExcel } from './utils/exportUtils';
import { REPORT_TYPES } from './constants/reportTypes';

const ReportList = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  
  const { loading, reportData, stats, loadStats, generateReport, setReportData } = useReports();

  useEffect(() => {
    loadStats();
    generateReport(reportType, dateRange);
  }, []);

  useEffect(() => {
    generateReport(reportType, dateRange);
  }, [reportType]);

  const handleGenerateReport = () => {
    generateReport(reportType, dateRange);
  };

  const handleExportExcel = () => {
    exportToExcel(reportData, reportType, REPORT_TYPES);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Báo cáo</h2>
      </div>

      <ReportStats stats={stats} />
      
      <ReportFilters
        reportType={reportType}
        setReportType={setReportType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        reportTypes={REPORT_TYPES}
        onGenerateReport={handleGenerateReport}
        onExportExcel={handleExportExcel}
        loading={loading}
        setReportData={setReportData}
      />

      <ReportTable
        columns={getColumnsByType(reportType)}
        reportData={reportData}
        loading={loading}
        reportTypes={REPORT_TYPES}
        reportType={reportType}
      />
    </div>
  );
};

export default ReportList;