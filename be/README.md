# Warehouse Management Backend

## Yêu cầu hệ thống
- Node.js >= 16
- PostgreSQL >= 12

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình database trong file `.env`:
```
DB_NAME=warehouse_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

3. Tạo database PostgreSQL:
```sql
CREATE DATABASE warehouse_db;
```

4. Chạy migration để tạo bảng:
```bash
npm run migrate
```

5. Khởi động server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

- `GET /api` - Thông tin API
- `POST /api/users` - Tạo người dùng
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/inventory/import` - Nhập kho
- `POST /api/inventory/export` - Xuất kho
- `GET /api/inventory/balance` - Tồn kho
- `POST /api/stock-check` - Tạo phiếu kiểm kê
- `GET /api/reports/inventory` - Báo cáo tồn kho

## Cấu trúc thư mục

```
be/
├── config/         # Cấu hình
├── controllers/    # Controllers
├── middleware/     # Middleware
├── models/         # Sequelize models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utilities
├── migrations/     # Database migrations
├── logs/           # Log files
└── reports/        # Generated reports
```