# Hệ thống quản lý kho hàng

Hệ thống quản lý kho hàng toàn diện được xây dựng với Node.js/Express cho backend và React.js cho frontend, hỗ trợ quản lý hiệu quả các hoạt động nhập xuất kho, theo dõi tồn kho và báo cáo thống kê.

## 🚀 Tổng quan dự án

Hệ thống cung cấp giải pháp hoàn chỉnh cho việc quản lý kho hàng với giao diện thân thiện và các tính năng mạnh mẽ, phù hợp cho các doanh nghiệp vừa và nhỏ.

### 🛠️ Công nghệ sử dụng

- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Frontend**: React.js, Ant Design, Recharts, Axios
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## ✨ Tính năng chính

### 📊 Dashboard & Thống kê
- Tổng quan thống kê kho hàng
- Biểu đồ giao dịch hàng ngày
- Xu hướng giá trị tồn kho
- Danh sách giao dịch gần nhất
- Bảng cảnh báo sản phẩm sắp hết hàng/hết hạn

### 📦 Quản lý sản phẩm
- Thêm, sửa, xóa sản phẩm với modular components
- Upload hình ảnh sản phẩm (hiển thị trong tất cả bảng)
- Quản lý thông tin chi tiết (SKU, giá, vị trí, hạn sử dụng)
- Tìm kiếm real-time và phân trang

### 🔄 Quản lý nhập xuất kho
- Tạo phiếu nhập kho với thông tin nhà cung cấp
- Tạo phiếu xuất kho với thông tin khách hàng
- Kiểm tra tồn kho tự động
- Lịch sử giao dịch chi tiết với hình ảnh sản phẩm
- Tách controllers theo domain (transaction, balance, chart)

### 📋 Kiểm kê kho
- Tạo phiếu kiểm kê với tìm kiếm sản phẩm thông minh
- So sánh số lượng thực tế vs hệ thống
- Phê duyệt/từ chối phiếu kiểm kê
- Cập nhật tồn kho tự động khi phê duyệt

### 📈 Báo cáo
- Báo cáo tồn kho với hình ảnh sản phẩm
- Báo cáo giao dịch nhập/xuất với biểu đồ
- Báo cáo sản phẩm sắp hết hàng
- Báo cáo sản phẩm sắp hết hạn
- Xuất báo cáo PDF với jsPDF

### 👥 Quản lý người dùng
- Phân quyền theo vai trò (Admin, Staff, Accountant)
- Quản lý thông tin cá nhân
- Upload avatar
- Lịch sử hoạt động

### 🏢 Quản lý nhà cung cấp
- Thêm, sửa, xóa nhà cung cấp
- Thông tin liên hệ chi tiết
- Liên kết với phiếu nhập kho

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm hoặc yarn

### Cài đặt nhanh

1. **Clone repository**
```bash
git clone <repository-url>
cd warehouse-management
```

2. **Cài đặt dependencies**
```bash
# Backend
cd be
npm install

# Frontend
cd ../fe
npm install
```

3. **Cấu hình môi trường**
```bash
# Tạo file .env trong thư mục be/
cp be/.env.example be/.env
# Chỉnh sửa thông tin database và JWT secret
```

4. **Chạy ứng dụng**
```bash
# Terminal 1 - Backend (port 5000)
cd be
npm run dev

# Terminal 2 - Frontend (port 3000)
cd fe
npm start
```

5. **Truy cập ứng dụng**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📚 Hướng dẫn chi tiết

### 🔧 Hướng dẫn cho Backend
Xem chi tiết tại: [be/README.md](./be/README.md)
- Cấu hình database
- API endpoints
- Authentication & Authorization
- Cấu trúc dự án backend

### 🎨 Hướng dẫn cho Frontend
Xem chi tiết tại: [fe/README.md](./fe/README.md)
- Cấu trúc components
- State management
- Routing
- UI/UX guidelines

## 🔐 Tài khoản mặc định

```
Admin:
- Username: admin
- Password: admin123

Staff:
- Username: staff
- Password: staff123
```

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📞 Liên hệ

- Email: support@warehouse-management.com
- Documentation: [Wiki](./wiki)
- Issues: [GitHub Issues](./issues)