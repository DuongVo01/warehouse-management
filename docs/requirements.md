# Requirements – Hệ thống Quản lý Kho hàng

## 1. Giới thiệu
- **Tên hệ thống**: Warehouse Management System (WMS)  
- **Mục tiêu**: Hỗ trợ doanh nghiệp quản lý hoạt động nhập – xuất – tồn kho, giảm thất thoát, tối ưu vận hành.  
- **Người dùng chính**:
  - Quản trị viên (Admin)
  - Nhân viên kho (Staff)
  - Kế toán (Accountant)

---

## 2. Phạm vi
Hệ thống phục vụ:
- Quản lý thông tin sản phẩm, nhà cung cấp.
- Quản lý nhập kho, xuất kho, kiểm kê.
- Theo dõi tồn kho theo thời gian thực.
- Sinh báo cáo phục vụ quản lý và kế toán.
- Tìm kiếm và lọc dữ liệu theo nhiều tiêu chí.

---

## 3. Yêu cầu chức năng đã triển khai

### 3.1. Quản lý sản phẩm ✅
- Thêm / sửa / xóa sản phẩm với modular components
- Thuộc tính: SKU, tên, đơn vị tính, giá nhập, giá bán, hạn sử dụng, vị trí kệ, trạng thái
- Tìm kiếm theo tên, SKU, trạng thái với real-time filtering
- Phân trang và sắp xếp dữ liệu

### 3.2. Nhập kho ✅
- Tạo phiếu nhập kho với form validation
- Chọn nhà cung cấp từ dropdown
- Cập nhật tồn kho tự động
- Ghi nhận lịch sử giao dịch
- Tính toán tổng giá trị tự động

### 3.3. Xuất kho ✅
- Tạo phiếu xuất kho với kiểm tra tồn kho
- Nhập thông tin khách hàng
- Cập nhật tồn kho khi xuất
- Cảnh báo khi không đủ hàng
- Ghi nhận lịch sử xuất kho

### 3.4. Quản lý tồn kho ✅
- Theo dõi số lượng tồn theo thời gian thực
- Hiển thị thông tin sản phẩm chi tiết
- Cảnh báo tồn kho thấp và hàng sắp hết hạn
- Tìm kiếm và lọc theo nhiều tiêu chí

### 3.5. Kiểm kê kho ✅
- Tạo phiếu kiểm kê với auto-generate mã phiếu
- Tự động lấy số lượng hệ thống từ tồn kho
- So sánh số lượng thực tế với hệ thống
- Workflow duyệt phiếu (Pending → Approved/Rejected)
- Cập nhật tồn kho tự động khi duyệt
- Tìm kiếm và lọc phiếu kiểm kê

### 3.6. Báo cáo & Thống kê ✅
- Báo cáo tồn kho, giao dịch, hàng sắp hết, hàng hết hạn
- Lọc theo khoảng thời gian
- Tìm kiếm trong dữ liệu báo cáo
- Xuất báo cáo ra Excel/PDF
- Dashboard với thống kê tổng quan

### 3.7. Quản lý nhà cung cấp ✅
- CRUD nhà cung cấp với modular components
- Thông tin: tên, mã số thuế, liên hệ, địa chỉ, trạng thái
- Tìm kiếm theo tên, liên hệ, trạng thái
- Quản lý trạng thái hoạt động

### 3.8. Quản trị hệ thống ✅
- Quản lý người dùng với phân quyền
- 3 vai trò: Admin, Staff, Accountant
- Tìm kiếm và lọc người dùng
- Quản lý trạng thái tài khoản
- Profile cá nhân với cập nhật thông tin

---

## 4. Kiến trúc hệ thống

### 4.1. Frontend (React.js)
- **Modular Architecture**: Tách components, hooks, utils
- **State Management**: Custom hooks cho từng module
- **UI Framework**: Ant Design
- **Routing**: React Router với protected routes
- **Search & Filter**: Real-time filtering cho tất cả modules

### 4.2. Backend (Node.js + Express)
- **RESTful API**: Chuẩn REST với status codes
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT tokens
- **Authorization**: Role-based access control
- **Validation**: Input validation và error handling

### 4.3. Database (MongoDB)
- **Collections**: Users, Products, Suppliers, InventoryTransactions, InventoryBalance, StockChecks
- **Relationships**: Populated references
- **Indexing**: Optimized queries
- **Audit Trail**: Timestamps và user tracking

---

## 5. Tính năng nổi bật đã triển khai

### 5.1. Tìm kiếm thông minh
- Real-time search trên tất cả modules
- Multi-field search (tên, mã, người tạo, etc.)
- Kết hợp search + filter
- Debounced input để tối ưu performance

### 5.2. Modular Components
- Tách biệt logic và UI
- Reusable components
- Custom hooks cho state management
- Consistent code structure

### 5.3. User Experience
- Responsive design
- Loading states
- Error handling với user-friendly messages
- Form validation với real-time feedback
- Confirmation dialogs cho actions quan trọng

### 5.4. Security & Authorization
- JWT authentication
- Role-based menu và features
- Protected routes
- API authorization middleware

---

## 6. Yêu cầu phi chức năng đã đáp ứng
- **Hiệu năng**: Optimized queries, pagination, debounced search
- **Bảo mật**: JWT auth, role-based access, input validation
- **Khả năng mở rộng**: Modular architecture, clean code structure
- **User Experience**: Intuitive UI, responsive design, error handling

---

## 7. Công nghệ sử dụng

### Frontend
- React.js 18+
- Ant Design UI Framework
- React Router v6
- Axios for API calls
- Day.js for date handling

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS middleware

### Development Tools
- ESLint + Prettier
- Git version control
- Modular file structure
- Environment variables

---

## 8. Tương lai mở rộng
- Tích hợp barcode/QR code scanning
- Mobile app cho nhân viên kho
- Real-time notifications
- Advanced analytics và AI insights
- Multi-warehouse support
- Integration với ERP systems