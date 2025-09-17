import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSuppliers } from './hooks/useSuppliers';
import SupplierTable from './components/SupplierTable';
import SupplierForm from './components/SupplierForm';

const SupplierList = () => {
  const { suppliers, loading, deleteSupplier, saveSupplier } = useSuppliers();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();



  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setModalVisible(true);
  };

  const handleDelete = (supplierId) => {
    deleteSupplier(supplierId);
  };

  const handleSubmit = async (values) => {
    const success = await saveSupplier(values, editingSupplier);
    if (success) {
      setModalVisible(false);
      form.resetFields();
      setEditingSupplier(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingSupplier(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý nhà cung cấp</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm nhà cung cấp
        </Button>
      </div>

      <SupplierTable 
        suppliers={suppliers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SupplierForm
        visible={modalVisible}
        editingSupplier={editingSupplier}
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SupplierList;