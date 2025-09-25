import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

// Components
import ReportStats from './components/ReportStats';
import ReportFilters from './components/ReportFilters';
import ReportTable from './components/ReportTable';

// Hooks & Utils
import { useReports } from './hooks/useReports';
import { getColumnsByType } from './utils/reportColumns';
import { exportToExcel, exportToPDF } from './utils/exportUtils';
import { REPORT_TYPES } from './constants/reportTypes';

const ReportList = () => {
  const [searchParams] = useSearchParams();
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  
  const { 
    loading, 
    reportData, 
    searchText,
    setSearchText,
    stats, 
    loadStats, 
    generateReport, 
    setReportData,
    filterReportData
  } = useReports();

  const handleSearchChange = (value) => {
    setSearchText(value);
    filterReportData(value);
  };

  useEffect(() => {
    // Kiểm tra URL params để tự động chọn loại báo cáo
    const typeParam = searchParams.get('type');
    if (typeParam && ['inventory', 'transactions', 'lowstock', 'expiring', 'expired'].includes(typeParam)) {
      setReportType(typeParam);
    }
    
    loadStats();
    generateReport(typeParam || reportType, dateRange);
  }, [searchParams]);

  useEffect(() => {
    generateReport(reportType, dateRange);
  }, [reportType]);

  const handleGenerateReport = () => {
    generateReport(reportType, dateRange);
  };

  const handleExportExcel = () => {
    exportToExcel(reportData, reportType, REPORT_TYPES);
  };

  const handleExportPDF = () => {
    exportToPDF(reportData, reportType, REPORT_TYPES);
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
        onExportPDF={handleExportPDF}
        loading={loading}
        setReportData={setReportData}
        searchText={searchText}
        onSearchChange={handleSearchChange}
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