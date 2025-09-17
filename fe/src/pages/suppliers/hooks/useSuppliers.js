import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { supplierAPI } from '../../../services/api/supplierAPI';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierAPI.getSuppliers();
      if (response.data.success) {
        setSuppliers(response.data.data || []);
      } else {
        message.error(response.data.message || 'Lỗi tải danh sách nhà cung cấp');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi tải danh sách nhà cung cấp');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (supplierId, force = false) => {
    try {
      const url = force ? `${supplierId}?force=true` : supplierId;
      const response = await supplierAPI.deleteSupplier(url);
      if (response.data.success) {
        setSuppliers(suppliers.filter(s => s._id !== supplierId));
        message.success('Xóa nhà cung cấp thành công');
      } else {
        message.error(response.data.message || 'Lỗi xóa nhà cung cấp');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.canForceDelete) {
        Modal.confirm({
          title: 'Xóa nhà cung cấp',
          content: `${error.response.data.message}. Bạn có muốn xóa bắt buộc (bao gồm cả các giao dịch liên quan)?`,
          okText: 'Xóa bắt buộc',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: () => deleteSupplier(supplierId, true)
        });
      } else if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error(error.response?.data?.message || 'Lỗi xóa nhà cung cấp');
      }
    }
  };

  const saveSupplier = async (values, editingSupplier) => {
    try {
      if (editingSupplier) {
        const response = await supplierAPI.updateSupplier(editingSupplier._id, values);
        if (response.data.success) {
          const updatedSuppliers = suppliers.map(s => 
            s._id === editingSupplier._id ? { ...s, ...values } : s
          );
          setSuppliers(updatedSuppliers);
          message.success('Cập nhật nhà cung cấp thành công');
          return true;
        } else {
          message.error(response.data.message || 'Lỗi cập nhật nhà cung cấp');
          return false;
        }
      } else {
        const response = await supplierAPI.createSupplier(values);
        if (response.data.success) {
          const newSupplier = response.data.data;
          setSuppliers([...suppliers, newSupplier]);
          message.success('Thêm nhà cung cấp thành công');
          return true;
        } else {
          message.error(response.data.message || 'Lỗi thêm nhà cung cấp');
          return false;
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
      } else {
        message.error('Lỗi lưu thông tin nhà cung cấp');
      }
      return false;
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    deleteSupplier,
    saveSupplier
  };
};