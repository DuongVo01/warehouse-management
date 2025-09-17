# System Architecture – Hệ thống Quản lý Kho hàng

## 1. Tổng quan kiến trúc

### 1.1. Architecture Pattern
- **Pattern**: 3-Tier Architecture (Presentation → Business Logic → Data)
- **Frontend**: React.js SPA (Single Page Application)
- **Backend**: Node.js + Express.js RESTful API
- **Database**: MongoDB (NoSQL Document Database)
- **Authentication**: JWT (JSON Web Tokens)

### 1.2. Technology Stack
```
Frontend:  React 18+ | Ant Design | React Router | Axios
Backend:   Node.js | Express.js | Mongoose ODM
Database:  MongoDB | MongoDB Compass (GUI)
Auth:      JWT | bcrypt | localStorage
Tools:     Git | VS Code | Postman | Chrome DevTools
```

---

## 2. Frontend Architecture (React.js)

### 2.1. Project Structure
```
src/
├── components/           # Shared components
├── layouts/             # Layout components
│   ├── components/      # Layout-specific components
│   ├── hooks/          # Layout hooks
│   └── utils/          # Layout utilities
├── pages/              # Page components (modular)
│   ├── products/       # Product management module
│   │   ├── components/ # Product-specific components
│   │   ├── hooks/      # Product hooks
│   │   └── utils/      # Product utilities
│   ├── inventory/      # Inventory management module
│   ├── suppliers/      # Supplier management module
│   ├── reports/        # Reports module
│   ├── users/          # User management module
│   └── profile/        # User profile module
├── services/           # API services
│   └── api/           # API endpoints
├── utils/             # Global utilities
└── App.js             # Main application
```

### 2.2. Modular Component Architecture
```javascript
// Example: Product Module Structure
pages/products/
├── ProductList.jsx           # Main page component
├── components/
│   ├── ProductTable.jsx      # Data display component
│   ├── ProductForm.jsx       # Form component
│   ├── ProductSearch.jsx     # Search component
│   └── ProductStats.jsx      # Statistics component
├── hooks/
│   └── useProducts.js        # State management hook
└── utils/
    └── productValidation.js  # Validation utilities
```

### 2.3. State Management Pattern
```javascript
// Custom Hook Pattern
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Business logic methods
  const loadProducts = async () => { /* ... */ };
  const createProduct = async (data) => { /* ... */ };
  const updateProduct = async (id, data) => { /* ... */ };
  
  return {
    products,
    loading,
    searchText,
    setSearchText,
    loadProducts,
    createProduct,
    updateProduct
  };
};
```

### 2.4. Component Communication
- **Props**: Parent → Child data flow
- **Callbacks**: Child → Parent event handling
- **Custom Hooks**: Shared state logic
- **Context**: Global state (minimal usage)

---

## 3. Backend Architecture (Node.js + Express)

### 3.1. Project Structure
```
be/
├── controllers/        # Business logic controllers
│   ├── authController.js
│   ├── productController.js
│   ├── inventoryController.js
│   ├── supplierController.js
│   ├── userController.js
│   └── reportController.js
├── models/            # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Supplier.js
│   ├── InventoryTransaction.js
│   ├── InventoryBalance.js
│   └── StockCheck.js
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── inventoryRoutes.js
│   ├── supplierRoutes.js
│   ├── userRoutes.js
│   └── reportRoutes.js
├── middleware/        # Custom middleware
│   ├── auth.js        # JWT authentication
│   ├── role.js        # Role-based authorization
│   └── validation.js  # Input validation
├── config/           # Configuration files
│   └── database.js   # MongoDB connection
└── server.js         # Main server file
```

### 3.2. API Design Pattern
```javascript
// RESTful API Structure
GET    /api/products           # Get all products
POST   /api/products           # Create product
GET    /api/products/:id       # Get product by ID
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product

// Consistent Response Format
{
  success: boolean,
  data: object | array,
  message: string,
  error: string (optional)
}
```

### 3.3. Middleware Stack
```javascript
// Express Middleware Chain
app.use(cors());                    # CORS handling
app.use(express.json());            # JSON parsing
app.use('/api/auth', authRoutes);   # Public routes
app.use('/api/*', auth);            # JWT authentication
app.use('/api/users', role(['Admin']), userRoutes); # Authorization
```

### 3.4. Error Handling Pattern
```javascript
// Centralized Error Handling
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      error: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ'
  });
};
```

---

## 4. Database Architecture (MongoDB)

### 4.1. Schema Design Philosophy
- **Document-based**: Flexible schema cho business objects
- **Embedded vs Referenced**: Balance giữa performance và consistency
- **Indexing Strategy**: Optimize cho common queries
- **Validation**: Schema-level và application-level validation

### 4.2. Collection Relationships
```javascript
// Reference Relationships (Normalized)
User ←→ InventoryTransaction (createdBy)
Product ←→ InventoryTransaction (productId)
Product ←→ InventoryBalance (productId)
Supplier ←→ InventoryTransaction (supplierId)

// Embedded Documents (Denormalized)
// Minimal usage - chỉ cho data ít thay đổi
```

### 4.3. Data Consistency Strategy
```javascript
// Business Logic trong Controllers
const createImportTransaction = async (data) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // 1. Create transaction
      const transaction = await InventoryTransaction.create([data], { session });
      
      // 2. Update inventory balance
      await updateInventoryBalance(data.productId, data.quantity, session);
    });
  } finally {
    await session.endSession();
  }
};
```

### 4.4. Query Optimization
```javascript
// Efficient Queries với Indexing
// Index on frequently queried fields
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text' });
inventoryTransactionSchema.index({ productId: 1, createdAt: -1 });

// Lean Queries khi không cần full document
Product.find().lean().select('sku name costPrice');

// Pagination cho large datasets
Product.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });
```

---

## 5. Security Architecture

### 5.1. Authentication Flow
```
1. User Login → Validate Credentials → Generate JWT
2. Store JWT in localStorage (Frontend)
3. Include JWT in Authorization header
4. Verify JWT in middleware → Extract user info
5. Proceed to protected routes
```

### 5.2. Authorization Levels
```javascript
// Role-based Access Control
const roles = {
  Admin: ['*'],                    // Full access
  Staff: [                         // Inventory operations
    'products:read,write',
    'inventory:read,write',
    'stockcheck:read,write'
  ],
  Accountant: [                    // Reports only
    'products:read',
    'inventory:read',
    'reports:read'
  ]
};
```

### 5.3. Input Validation & Sanitization
```javascript
// Mongoose Schema Validation
const productSchema = new mongoose.Schema({
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

// Express Validator Middleware
const validateProduct = [
  body('name').trim().isLength({ min: 2, max: 200 }),
  body('costPrice').isNumeric().isFloat({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }
    next();
  }
];
```

---

## 6. Performance Architecture

### 6.1. Frontend Performance
```javascript
// Code Splitting với React.lazy
const ProductList = React.lazy(() => import('./pages/products/ProductList'));

// Debounced Search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Memoization cho expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

### 6.2. Backend Performance
```javascript
// Connection Pooling
mongoose.connect(mongoURI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Query Optimization
// Use lean() cho read-only queries
// Use select() để limit fields
// Use populate() efficiently
Product.find()
  .lean()
  .select('sku name costPrice')
  .populate('supplierId', 'name')
  .limit(50);
```

### 6.3. Caching Strategy
```javascript
// Client-side Caching
// localStorage cho user preferences
// Memory caching cho frequently accessed data

// Server-side Caching (Future)
// Redis cho session storage
// Query result caching
// API response caching
```

---

## 7. Deployment Architecture

### 7.1. Development Environment
```
Frontend: http://localhost:3001 (React Dev Server)
Backend:  http://localhost:3000 (Node.js + Express)
Database: mongodb://localhost:27017/warehouse-management
```

### 7.2. Production Considerations
```
Frontend: Build → Static files → Web Server (Nginx/Apache)
Backend:  PM2 Process Manager → Load Balancer → Multiple Instances
Database: MongoDB Atlas → Replica Set → Automated Backups
Security: HTTPS → Environment Variables → Rate Limiting
```

### 7.3. Monitoring & Logging
```javascript
// Application Logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Performance Monitoring
// Response time tracking
// Error rate monitoring
// Database query performance
```

---

## 8. Scalability Considerations

### 8.1. Horizontal Scaling
- **Frontend**: CDN distribution, multiple server instances
- **Backend**: Load balancer, multiple Node.js instances
- **Database**: MongoDB sharding, read replicas

### 8.2. Vertical Scaling
- **Memory**: Increase RAM cho Node.js processes
- **CPU**: Multi-core processing với cluster module
- **Storage**: SSD storage cho database performance

### 8.3. Future Architecture Evolution
```
Current:  Monolithic → Modular Monolith
Future:   Microservices → Event-driven Architecture
          API Gateway → Service Mesh
          Container Orchestration (Kubernetes)
```

---

## 9. Integration Architecture

### 9.1. API Integration Points
```javascript
// External System Integration
// ERP Systems → REST API endpoints
// Barcode Scanners → WebSocket connections
// Email Services → SMTP integration
// File Storage → Cloud storage APIs
```

### 9.2. Data Exchange Formats
```javascript
// JSON for API communication
// CSV/Excel for data import/export
// PDF for report generation
// WebSocket for real-time updates
```

---

## 10. Maintenance & Updates

### 10.1. Code Maintenance
- **Modular Structure**: Easy to locate và update specific features
- **Consistent Patterns**: Standardized code structure across modules
- **Documentation**: Inline comments và external documentation
- **Testing**: Unit tests cho critical business logic

### 10.2. Database Maintenance
- **Migration Scripts**: Schema updates và data migrations
- **Backup Strategy**: Regular automated backups
- **Performance Monitoring**: Query optimization và index management
- **Data Archival**: Historical data management