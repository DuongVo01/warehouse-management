import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { useInventory } from './hooks/useInventory';
import { useInventoryItems } from './hooks/useInventoryItems';
import { useProducts } from './hooks/useProducts';
import { useSuppliers } from './hooks/useSuppliers';
import ProductSelector from './components/ProductSelector';
import InventoryTable from './components/InventoryTable';
import SupplierSelector from './components/SupplierSelector';
import ImportSummary from './components/ImportSummary';
import { validateInventoryForm, prepareInventoryData } from './utils/inventoryHelpers';

const InventoryImport = () => {
  const [form] = Form.useForm();
  const { loading, setLoading, importInventory } = useInventory();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const { items, addItem, removeItem, clearItems } = useInventoryItems(products);

  const handleAddItem = (values) => {
    const success = addItem(values, false); // false for import
    if (success) {
      form.resetFields(['productId', 'quantity', 'unitPrice']);
    }
  };

  const onFinish = async (values) => {
    const validationError = validateInventoryForm(items, values, false);
    if (validationError) {
      message.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const importItems = prepareInventoryData(items, values, false);
      
      for (const importData of importItems) {
        const success = await importInventory(importData);
        if (!success) {
          setLoading(false);
          return;
        }
      }
      
      message.success(`Nhập kho thành công ${items.length} sản phẩm`);
      form.resetFields();
      clearItems();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearItems();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Nhập kho</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <SupplierSelector suppliers={suppliers} />

        <ProductSelector 
          products={products}
          onAdd={handleAddItem}
          form={form}
          showUnitPrice={true}
          isExport={false}
        />

        <InventoryTable 
          items={items}
          onRemove={removeItem}
          showUnitPrice={true}
        />

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

        <ImportSummary 
          items={items}
          loading={loading}
          onCancel={handleCancel}
        />
      </Form>
    </div>
  );
};

export default InventoryImport;