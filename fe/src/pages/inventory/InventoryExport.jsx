import React, { useState } from 'react';
import { Form, Input, Button, Space, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useInventory } from './hooks/useInventory';
import { useInventoryItems } from './hooks/useInventoryItems';
import ProductSelector from './components/ProductSelector';
import InventoryTable from './components/InventoryTable';
import { validateInventoryForm, prepareInventoryData } from './utils/inventoryHelpers';

const InventoryExport = () => {
  const [form] = Form.useForm();
  const { products, loading, setLoading, loadProducts, exportInventory } = useInventory();
  const { items, addItem, removeItem, clearItems } = useInventoryItems(products);

  const handleAddItem = (values) => {
    const success = addItem(values, true); // true for export
    if (success) {
      form.resetFields(['productId', 'quantity']);
    }
  };

  const onFinish = async (values) => {
    const validationError = validateInventoryForm(items, values, true);
    if (validationError) {
      message.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const exportItems = prepareInventoryData(items, values, true);
      
      for (const exportData of exportItems) {
        const success = await exportInventory(exportData);
        if (!success) {
          setLoading(false);
          return;
        }
      }
      
      message.success(`Xuất kho thành công ${items.length} sản phẩm`);
      form.resetFields();
      clearItems();
      loadProducts();
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
        <h2>Xuất kho</h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Form.Item name="customerInfo" label="Thông tin khách hàng" rules={[{ required: true }]}>
            <Input placeholder="Tên khách hàng hoặc mã đơn hàng" />
          </Form.Item>
          <Form.Item name="exportDate" label="Ngày xuất" initialValue={dayjs()}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <ProductSelector 
          products={products}
          onAdd={handleAddItem}
          form={form}
          isExport={true}
        />

        <InventoryTable 
          items={items}
          onRemove={removeItem}
        />

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu phiếu xuất
          </Button>
          <Button onClick={handleCancel} disabled={loading}>
            Hủy
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default InventoryExport;