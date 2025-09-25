import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useStockCheck } from './hooks/useStockCheck';
import StockCheckStatsCards from './components/StockCheckStatsCards';
import StockCheckTable from './components/StockCheckTable';
import StockCheckForm from './components/StockCheckForm';
import StockCheckDetailModal from './components/StockCheckDetailModal';
import StockCheckSearch from './components/StockCheckSearch';

const StockCheck = () => {
  const [searchParams] = useSearchParams();
  const {
    stockChecks,
    products,
    loading,
    userRole,
    currentStock,
    setCurrentStock,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    handleProductChange,
    createStockCheck,
    approveStockCheck,
    rejectStockCheck,
    loadStockChecks
  } = useStockCheck();

  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);

  const handleCreateCheck = async (values) => {
    const checkData = {
      productId: values.productId,
      actualQuantity: values.actualQuantity,
      note: values.note
    };
    
    const result = await createStockCheck(checkData);
    if (result.success) {
      setModalVisible(false);
      setCurrentStock(0);
    }
    return result;
  };

  const handleReject = (checkId) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: 'Bạn có chắc chắn muốn từ chối phiếu kiểm kê này?',
      onOk: () => rejectStockCheck(checkId)
    });
  };

  const handleViewDetail = (record) => {
    setSelectedCheck(record);
    setDetailModalVisible(true);
  };
  
  // Tự động mở chi tiết phiếu kiểm kê từ URL
  useEffect(() => {
    const stockCheckId = searchParams.get('id');
    if (stockCheckId && stockChecks.length > 0) {
      const targetCheck = stockChecks.find(check => check._id === stockCheckId);
      if (targetCheck) {
        handleViewDetail(targetCheck);
      }
    }
  }, [searchParams, stockChecks]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentStock(0);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Kiểm kê kho</h2>
      </div>

      <StockCheckStatsCards stockChecks={stockChecks} />

      <StockCheckSearch
        searchText={searchText}
        onSearchChange={setSearchText}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onRefresh={loadStockChecks}
      />

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Tạo phiếu kiểm kê
        </Button>
      </div>

      <StockCheckTable
        stockChecks={stockChecks}
        loading={loading}
        userRole={userRole}
        onViewDetail={handleViewDetail}
        onApprove={approveStockCheck}
        onReject={handleReject}
      />

      <StockCheckForm
        visible={modalVisible}
        onCancel={handleCloseModal}
        onSubmit={handleCreateCheck}
        products={products}
        currentStock={currentStock}
        onProductChange={handleProductChange}
      />

      <StockCheckDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        stockCheck={selectedCheck}
      />
    </div>
  );
};

export default StockCheck;