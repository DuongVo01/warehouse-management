import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategories } from './hooks/useCategories';
import CategoryTable from './components/CategoryTable';
import CategoryModal from './components/CategoryModal';
import CategoryFilters from './components/CategoryFilters';

const Categories = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  
  const { 
    categories, 
    loading, 
    loadCategories,
    createCategory, 
    updateCategory, 
    deleteCategory,
    searchCategories
  } = useCategories();

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý danh mục</h2>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Thêm danh mục
        </Button>
      </div>

      <CategoryFilters
        onSearch={searchCategories}
        onRefresh={loadCategories}
      />

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteCategory}
      />

      <CategoryModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={{
          create: createCategory,
          update: updateCategory
        }}
        editingCategory={editingCategory}
        form={form}
      />
    </div>
  );
};

export default Categories;