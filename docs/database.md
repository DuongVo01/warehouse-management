# Database Design – Hệ thống Quản lý Kho hàng

## 1. Công nghệ Database
- **Database**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose cho Node.js
- **Hosting**: Local MongoDB instance
- **Connection**: MongoDB connection string với authentication

---

## 2. Collections (Tương đương Tables trong SQL)

### 2.1. Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  employeeCode: String (required, unique), // Auto-generated: NV0001
  passwordHash: String (required),
  fullName: String (required),
  role: String (enum: ['Admin', 'Staff', 'Accountant']),
  email: String (required, unique, lowercase),
  phone: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2.2. Products Collection
```javascript
{
  _id: ObjectId,
  sku: String (required, unique), // Auto-generated: SP0001
  name: String (required),
  unit: String (required), // cái, hộp, thùng, kg, etc.
  costPrice: Number (required),
  salePrice: Number (required),
  expiryDate: Date (optional),
  location: String (optional), // Vị trí kệ
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2.3. Suppliers Collection
```javascript
{
  _id: ObjectId,
  supplierCode: String (required, unique), // Auto-generated
  name: String (required),
  address: String (optional),
  phone: String (optional),
  email: String (optional),
  taxCode: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2.4. InventoryTransactions Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: 'Product', required),
  transactionType: String (enum: ['Import', 'Export', 'Adjustment_In', 'Adjustment_Out']),
  quantity: Number (required), // Positive for import, negative for export
  unitPrice: Number (optional),
  supplierId: ObjectId (ref: 'Supplier', optional), // For imports
  customerInfo: String (optional), // For exports
  note: String (optional),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2.5. InventoryBalance Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: 'Product', required, unique),
  quantity: Number (required, default: 0),
  lastUpdated: Date (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### 2.6. StockChecks Collection
```javascript
{
  _id: ObjectId,
  checkId: String (unique), // Auto-generated: SC000001
  productId: ObjectId (ref: 'Product', required),
  systemQuantity: Number (required), // Auto-filled from InventoryBalance
  actualQuantity: Number (required), // User input
  difference: Number (calculated: actualQuantity - systemQuantity),
  status: String (enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'),
  note: String (optional),
  createdBy: ObjectId (ref: 'User', required),
  approvedBy: ObjectId (ref: 'User', optional),
  approvedAt: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 3. Relationships & Population

### 3.1. Reference Relationships
- **Users** → **InventoryTransactions** (createdBy)
- **Users** → **StockChecks** (createdBy, approvedBy)
- **Products** → **InventoryTransactions** (productId)
- **Products** → **InventoryBalance** (productId)
- **Products** → **StockChecks** (productId)
- **Suppliers** → **InventoryTransactions** (supplierId)

### 3.2. Population Examples
```javascript
// Get transactions with product and user info
InventoryTransaction.find()
  .populate('productId', 'sku name unit')
  .populate('supplierId', 'name')
  .populate('createdBy', 'fullName employeeCode')

// Get stock checks with related data
StockCheck.find()
  .populate('productId', 'sku name unit')
  .populate('createdBy', 'fullName employeeCode')
  .populate('approvedBy', 'fullName employeeCode')
```

---

## 4. Indexes for Performance

### 4.1. Unique Indexes
- `users.username`
- `users.email`
- `users.employeeCode`
- `products.sku`
- `suppliers.supplierCode`
- `stockchecks.checkId`
- `inventorybalance.productId`

### 4.2. Compound Indexes
```javascript
// For transaction queries
{ productId: 1, createdAt: -1 }
{ transactionType: 1, createdAt: -1 }
{ createdBy: 1, createdAt: -1 }

// For stock check queries
{ status: 1, createdAt: -1 }
{ productId: 1, status: 1 }
```

---

## 5. Data Validation & Constraints

### 5.1. Mongoose Schema Validation
```javascript
// Example: Product schema validation
const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  }
});
```

### 5.2. Pre-save Hooks
```javascript
// Auto-generate SKU
productSchema.pre('save', async function(next) {
  if (!this.sku) {
    const count = await this.constructor.countDocuments();
    this.sku = `SP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate difference in StockCheck
stockCheckSchema.pre('save', function(next) {
  this.difference = this.actualQuantity - this.systemQuantity;
  next();
});
```

---

## 6. Business Logic Implementation

### 6.1. Inventory Balance Updates
```javascript
// Helper function to update inventory balance
const updateInventoryBalance = async (productId, quantityChange) => {
  const balance = await InventoryBalance.findOne({ productId });
  
  if (balance) {
    balance.quantity += quantityChange;
    balance.lastUpdated = new Date();
    await balance.save();
  } else {
    await InventoryBalance.create({
      productId,
      quantity: Math.max(0, quantityChange),
      lastUpdated: new Date()
    });
  }
};
```

### 6.2. Stock Check Approval Process
```javascript
// When stock check is approved
const approveStockCheck = async (stockCheckId, userId) => {
  const stockCheck = await StockCheck.findById(stockCheckId);
  
  // Update stock check status
  stockCheck.status = 'Approved';
  stockCheck.approvedBy = userId;
  stockCheck.approvedAt = new Date();
  await stockCheck.save();
  
  // Update inventory balance
  const difference = stockCheck.actualQuantity - stockCheck.systemQuantity;
  if (difference !== 0) {
    await updateInventoryBalance(stockCheck.productId, difference);
    
    // Create adjustment transaction
    await InventoryTransaction.create({
      productId: stockCheck.productId,
      transactionType: difference > 0 ? 'Adjustment_In' : 'Adjustment_Out',
      quantity: Math.abs(difference),
      note: `Điều chỉnh từ kiểm kê ${stockCheck.checkId}`,
      createdBy: userId
    });
  }
};
```

---

## 7. Query Patterns

### 7.1. Common Queries
```javascript
// Get low stock products
InventoryBalance.find({ quantity: { $lte: 10 } })
  .populate('productId', 'sku name unit');

// Get expiring products (next 30 days)
const thirtyDaysFromNow = new Date(Date.now() + 30*24*60*60*1000);
Product.find({ 
  expiryDate: { $lte: thirtyDaysFromNow },
  isActive: true 
});

// Get transactions by date range
InventoryTransaction.find({
  createdAt: {
    $gte: startDate,
    $lte: endDate
  }
}).populate('productId supplierId createdBy');
```

### 7.2. Aggregation Pipelines
```javascript
// Calculate total inventory value
InventoryBalance.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product'
    }
  },
  {
    $unwind: '$product'
  },
  {
    $group: {
      _id: null,
      totalValue: {
        $sum: { $multiply: ['$quantity', '$product.costPrice'] }
      }
    }
  }
]);
```

---

## 8. Backup & Recovery Strategy

### 8.1. Regular Backups
- Daily automated backups using `mongodump`
- Weekly full database exports
- Transaction log backups for point-in-time recovery

### 8.2. Data Integrity
- Regular validation scripts
- Consistency checks between InventoryBalance and InventoryTransactions
- Audit trails for all critical operations

---

## 9. Performance Considerations

### 9.1. Optimization Techniques
- Proper indexing on frequently queried fields
- Pagination for large datasets
- Lean queries when full documents not needed
- Connection pooling for concurrent requests

### 9.2. Monitoring
- Query performance monitoring
- Index usage statistics
- Database size and growth tracking
- Connection pool metrics