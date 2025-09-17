import React from 'react';
import { Form, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const SupplierSelector = ({ suppliers }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <Form.Item name="supplierId" label="Nhà cung cấp" rules={[{ required: true }]}>
        <Select 
          placeholder="Chọn nhà cung cấp"
          showSearch
          filterOption={(input, option) => {
            const supplier = suppliers.find(s => s._id === option.value);
            if (supplier) {
              const searchText = `${supplier.supplierCode} ${supplier.name}`.toLowerCase();
              return searchText.includes(input.toLowerCase());
            }
            return false;
          }}
        >
          {suppliers.map(supplier => (
            <Select.Option key={supplier._id} value={supplier._id}>
              {supplier.supplierCode} - {supplier.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="importDate" label="Ngày nhập" initialValue={dayjs()}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
};

export default SupplierSelector;