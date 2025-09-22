# Backend - Hệ thống quản lý kho hàng

Backend API cho hệ thống quản lý kho hàng được xây dựng với Node.js và Express.js, cung cấp các API RESTful để quản lý sản phẩm, nhập xuất kho, kiểm kê và báo cáo.

## 📋 Tóm tắt về Backend

Backend cung cấp:
- API RESTful cho tất cả chức năng quản lý kho
- Xác thực và phân quyền người dùng
- Upload và quản lý file hình ảnh
- Tạo báo cáo PDF
- Thống kê và biểu đồ dữ liệu
- Quản lý giao dịch nhập/xuất kho

## 🛠️ Công nghệ sử dụng

- **Runtime**: Node.js >= 16.0.0
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **PDF Generation**: jsPDF, html2canvas
- **Validation**: Express Validator
- **Security**: bcryptjs, helmet, cors
- **Environment**: dotenv
- **Development**: nodemon

## 📦 Cài đặt Dependencies

```bash
# Di chuyển vào thư mục backend
cd be

# Cài đặt dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### Dependencies chính:
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "helmet": "^6.0.0"
}
```

## ⚙️ Cấu hình file .env

Tạo file `.env` trong thư mục `be/` với nội dung:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/warehouse_management
# Hoặc sử dụng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/warehouse_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### Lưu ý cấu hình:
- `JWT_SECRET`: Sử dụng chuỗi ngẫu nhiên mạnh (ít nhất 32 ký tự)
- `MONGODB_URI`: Thay đổi theo cấu hình MongoDB của bạn
- `MAX_FILE_SIZE`: Kích thước file tối đa (5MB = 5242880 bytes)

## 🚀 Chạy Server

### Development Mode
```bash
# Chạy với nodemon (auto-restart)
npm run dev

# Hoặc
yarn dev
```

### Production Mode
```bash
# Chạy production
npm start

# Hoặc
yarn start
```

### Scripts có sẵn:
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "seed": "node scripts/seed.js"
}
```

Server sẽ chạy tại: `http://localhost:5000`

## 🔗 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/login          # Đăng nhập
POST   /api/auth/register       # Đăng ký (chỉ Admin)
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/logout         # Đăng xuất
```

### 👥 Users Management
```
GET    /api/users               # Lấy danh sách người dùng
POST   /api/users               # Tạo người dùng mới
GET    /api/users/:id           # Lấy thông tin người dùng
PUT    /api/users/:id           # Cập nhật người dùng
DELETE /api/users/:id           # Xóa người dùng
POST   /api/users/avatar        # Upload avatar
PUT    /api/users/:id/profile   # Cập nhật profile
```

### 📦 Products Management
```
GET    /api/products            # Lấy danh sách sản phẩm
POST   /api/products            # Tạo sản phẩm mới
GET    /api/products/:id        # Lấy thông tin sản phẩm
PUT    /api/products/:id        # Cập nhật sản phẩm
DELETE /api/products/:id        # Xóa sản phẩm
POST   /api/products/:id/image  # Upload hình ảnh sản phẩm
```

### 🏢 Suppliers Management
```
GET    /api/suppliers           # Lấy danh sách nhà cung cấp
POST   /api/suppliers           # Tạo nhà cung cấp mới
GET    /api/suppliers/:id       # Lấy thông tin nhà cung cấp
PUT    /api/suppliers/:id       # Cập nhật nhà cung cấp
DELETE /api/suppliers/:id       # Xóa nhà cung cấp
```

### 📋 Inventory Management
```
POST   /api/inventory/import    # Nhập kho
POST   /api/inventory/export    # Xuất kho
GET    /api/inventory/balance   # Lấy tồn kho
GET    /api/inventory/transactions # Lấy lịch sử giao dịch
GET    /api/inventory/stats     # Thống kê dashboard
```

### 🔍 Stock Check
```
GET    /api/inventory/stock-checks        # Lấy danh sách kiểm kê
POST   /api/inventory/stock-checks        # Tạo phiếu kiểm kê
PUT    /api/inventory/stock-checks/:id/approve # Phê duyệt kiểm kê
PUT    /api/inventory/stock-checks/:id/reject  # Từ chối kiểm kê
```

### 📊 Charts & Analytics
```
GET    /api/inventory/daily-transactions  # Dữ liệu biểu đồ giao dịch
GET    /api/inventory/trend              # Xu hướng giá trị tồn kho
```

### 📈 Reports
```
GET    /api/reports/inventory    # Báo cáo tồn kho
GET    /api/reports/transactions # Báo cáo giao dịch
GET    /api/reports/low-stock    # Báo cáo sản phẩm sắp hết
GET    /api/reports/expiring     # Báo cáo sản phẩm sắp hết hạn
```

## 🔒 Authentication & Authorization

### Phân quyền người dùng:
- **Admin**: Toàn quyền truy cập
- **Staff**: Quản lý sản phẩm, nhập/xuất kho, kiểm kê
- **Accountant**: Xem báo cáo, thống kê

### Sử dụng JWT Token:
```javascript
// Header Authorization
Authorization: Bearer <jwt_token>
```

## 📁 Cấu trúc thư mục

```
be/
├── config/              # Cấu hình database, env
├── controllers/         # Controllers xử lý logic
│   ├── inventory/       # Controllers quản lý kho
│   ├── authController.js
│   ├── productController.js
│   └── userController.js
├── middleware/          # Middleware xác thực, validation
├── models/              # Mongoose models
├── routes/              # API routes
├── uploads/             # Thư mục lưu file upload
├── utils/               # Utility functions
├── server.js            # Entry point
└── package.json
```

## 🐛 Debugging

### Logs
Server sử dụng custom logger, logs được lưu tại console và file.

### Common Issues
1. **MongoDB Connection**: Kiểm tra MONGODB_URI trong .env
2. **JWT Error**: Kiểm tra JWT_SECRET và token expiry
3. **File Upload**: Kiểm tra quyền thư mục uploads/
4. **CORS Error**: Kiểm tra CLIENT_URL trong .env

## 📝 Testing

```bash
# Chạy tests
npm test

# Test với coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Checklist:
- [ ] Cấu hình biến môi trường production
- [ ] Sử dụng MongoDB Atlas hoặc MongoDB production
- [ ] Cấu hình HTTPS
- [ ] Thiết lập rate limiting
- [ ] Backup database định kỳ

### Environment Variables cho Production:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_production_secret
CLIENT_URL=https://yourdomain.com
```