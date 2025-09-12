# Frontend Structure - Warehouse Management System

## Cấu trúc thư mục

```
fe/
├── public/                 # Static files
├── src/
│   ├── assets/            # Tài nguyên tĩnh
│   │   ├── images/        # Hình ảnh, icons
│   │   └── styles/        # CSS, SCSS global
│   ├── components/        # Components tái sử dụng
│   │   ├── common/        # Button, Modal, Loading...
│   │   ├── forms/         # Form components
│   │   └── tables/        # Table, DataGrid components
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components (Header, Sidebar, Footer)
│   ├── pages/             # Các trang chính
│   │   ├── auth/          # Đăng nhập, đăng ký
│   │   ├── dashboard/     # Trang chủ, tổng quan
│   │   ├── inventory/     # Nhập kho, xuất kho, tồn kho, kiểm kê
│   │   ├── products/      # Quản lý sản phẩm
│   │   ├── reports/       # Báo cáo
│   │   ├── suppliers/     # Quản lý nhà cung cấp
│   │   └── users/         # Quản lý người dùng
│   ├── services/          # API calls
│   │   └── api/           # API endpoints
│   ├── store/             # State management (Redux/Zustand)
│   │   └── modules/       # Store modules theo chức năng
│   ├── utils/             # Utility functions
│   │   └── constants/     # Constants, enums
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── package.json
└── README.md
```

## Chức năng theo thư mục

### Pages
- **auth/**: Login, Register, ForgotPassword
- **dashboard/**: Tổng quan kho, thống kê nhanh
- **inventory/**: Import, Export, StockCheck, Balance
- **products/**: ProductList, ProductForm, ProductDetail
- **suppliers/**: SupplierList, SupplierForm
- **reports/**: ImportReport, ExportReport, InventoryReport
- **users/**: UserList, UserForm, Profile

### Components
- **common/**: Button, Modal, Alert, Loading, Pagination
- **forms/**: FormInput, FormSelect, FormDatePicker
- **tables/**: DataTable, FilterTable, ExportTable

### Services
- **api/**: authAPI, productAPI, inventoryAPI, reportAPI