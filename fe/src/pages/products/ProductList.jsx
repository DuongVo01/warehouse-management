import React, { useState } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useProducts } from './hooks/useProducts';
import ProductSearch from './components/ProductSearch';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';

const ProductList = () => {
  const { products, loading, searchProducts, deleteProduct, saveProduct } = useProducts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    searchProducts(searchValue);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      expiryDate: product.expiryDate ? dayjs(product.expiryDate) : null,
      location: product.location
    });
    setIsModalVisible(true);
  };

  const handleDelete = (productId) => {
    deleteProduct(productId);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const productData = {
        sku: values.sku,
        name: values.name,
        unit: values.unit,
        costPrice: values.costPrice,
        salePrice: values.salePrice,
        expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
        location: values.location
      };

      const success = await saveProduct(productData, editingProduct);
      if (success) {
        setIsModalVisible(false);
        form.resetFields();
        setEditingProduct(null);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý sản phẩm</h2>
      </div>
      
      <ProductSearch onSearch={handleSearch} onAdd={handleAdd} />
      
      <ProductTable 
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductForm
        visible={isModalVisible}
        editingProduct={editingProduct}
        form={form}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ProductList;