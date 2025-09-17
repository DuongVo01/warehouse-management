# Use Cases – Hệ thống Quản lý Kho hàng

## 1. Danh sách tác nhân (Actors)
- **Admin (Quản trị viên)**: Toàn quyền quản lý hệ thống, phân quyền, báo cáo
- **Staff (Nhân viên kho)**: Nhập kho, xuất kho, kiểm kê, tra cứu tồn kho
- **Accountant (Kế toán)**: Xem báo cáo nhập – xuất – tồn, kiểm soát chi phí
- **Supplier (Nhà cung cấp)**: Đối tượng liên quan trong nhập kho
- **Customer (Khách hàng)**: Đối tượng liên quan trong xuất kho

---

## 2. Use Cases đã triển khai

### UC01 – Đăng nhập hệ thống ✅
**Tác nhân:** Tất cả người dùng  
**Mục tiêu:** Xác thực và phân quyền truy cập  
**Luồng chính:**
1. Người dùng nhập username/password
2. Hệ thống xác thực thông tin
3. Tạo JWT token và lưu localStorage
4. Chuyển hướng đến dashboard theo role
5. Hiển thị menu phù hợp với quyền hạn

**Ngoại lệ:**
- Sai thông tin đăng nhập → hiển thị lỗi
- Tài khoản bị khóa → thông báo liên hệ admin

---

### UC02 – Quản lý sản phẩm ✅
**Tác nhân:** Admin, Staff  
**Mục tiêu:** CRUD sản phẩm với tìm kiếm và lọc  
**Luồng chính:**
1. Truy cập trang "Sản phẩm"
2. Xem danh sách với pagination
3. Tìm kiếm theo tên, SKU, trạng thái
4. Thêm/sửa/xóa sản phẩm qua modal form
5. Auto-generate SKU (SP0001, SP0002...)
6. Validation dữ liệu đầu vào

**Tính năng nâng cao:**
- Real-time search với debounce
- Filter theo trạng thái (Active/Inactive)
- Modular components (ProductTable, ProductForm, ProductSearch)

---

### UC03 – Nhập kho ✅
**Tác nhân:** Admin, Staff  
**Mục tiêu:** Ghi nhận hàng hóa nhập từ NCC  
**Luồng chính:**
1. Truy cập "Kho hàng" → "Nhập kho"
2. Chọn sản phẩm từ dropdown có search
3. Chọn nhà cung cấp
4. Nhập số lượng, đơn giá
5. Tự động tính tổng giá trị
6. Lưu phiếu nhập và cập nhật tồn kho
7. Tạo InventoryTransaction record

**Validation:**
- Kiểm tra sản phẩm tồn tại
- Số lượng và giá > 0
- Nhà cung cấp bắt buộc

---

### UC04 – Xuất kho ✅
**Tác nhân:** Admin, Staff  
**Mục tiêu:** Xuất hàng cho khách hàng  
**Luồng chính:**
1. Truy cập "Kho hàng" → "Xuất kho"
2. Chọn sản phẩm và nhập số lượng
3. Hệ thống kiểm tra tồn kho
4. Nhập thông tin khách hàng
5. Tạo phiếu xuất và trừ tồn kho
6. Ghi lại transaction history

**Ngoại lệ:**
- Không đủ tồn kho → cảnh báo và không cho xuất
- Hiển thị số lượng tồn hiện tại

---

### UC05 – Quản lý tồn kho ✅
**Tác nhân:** Tất cả roles  
**Mục tiêu:** Theo dõi tồn kho real-time  
**Luồng chính:**
1. Truy cập "Kho hàng" → "Tồn kho"
2. Xem danh sách sản phẩm và số lượng tồn
3. Tìm kiếm theo tên, SKU
4. Xem cảnh báo tồn thấp (≤ 10)
5. Xem cảnh báo hàng sắp hết hạn (30 ngày)
6. Dashboard statistics tổng quan

**Tính năng:**
- Real-time inventory updates
- Color-coded warnings
- Detailed product information

---

### UC06 – Kiểm kê kho ✅
**Tác nhân:** Admin, Staff (tạo), Admin (duyệt)  
**Mục tiêu:** Đối chiếu tồn kho thực tế với hệ thống  
**Luồng chính:**
1. Staff tạo phiếu kiểm kê
2. Chọn sản phẩm → tự động hiển thị số lượng hệ thống
3. Nhập số lượng thực tế
4. Hệ thống tính chênh lệch tự động
5. Lưu phiếu với status "Pending"
6. Admin duyệt/từ chối phiếu
7. Khi duyệt → tự động cập nhật tồn kho và tạo adjustment transaction

**Workflow:**
- Pending → Approved/Rejected
- Chỉ Admin mới thấy nút Duyệt/Từ chối
- Auto-generate checkId (SC000001)

---

### UC07 – Báo cáo & Thống kê ✅
**Tác nhân:** Admin, Accountant  
**Mục tiêu:** Theo dõi tình hình kho và xuất báo cáo  
**Luồng chính:**
1. Truy cập trang "Báo cáo"
2. Chọn loại báo cáo (Tồn kho, Giao dịch, Hàng sắp hết, Hàng hết hạn)
3. Chọn khoảng thời gian
4. Tìm kiếm trong dữ liệu báo cáo
5. Xem online hoặc export Excel/PDF
6. Dashboard với thống kê tổng quan

**Loại báo cáo:**
- Inventory Report: Tồn kho hiện tại
- Transaction Report: Lịch sử nhập/xuất
- Low Stock Report: Hàng sắp hết
- Expiring Report: Hàng sắp hết hạn

---

### UC08 – Quản lý nhà cung cấp ✅
**Tác nhân:** Admin  
**Mục tiêu:** CRUD nhà cung cấp  
**Luồng chính:**
1. Truy cập "Nhà cung cấp"
2. Xem danh sách với tìm kiếm
3. Thêm/sửa/xóa nhà cung cấp
4. Quản lý trạng thái (Active/Inactive)
5. Auto-generate supplier code

**Tính năng:**
- Search theo tên, liên hệ, địa chỉ
- Filter theo trạng thái
- Validation email, phone format

---

### UC09 – Quản trị người dùng ✅
**Tác nhân:** Admin  
**Mục tiêu:** Quản lý tài khoản và phân quyền  
**Luồng chính:**
1. Truy cập "Người dùng"
2. Xem danh sách user với role
3. Thêm/sửa/xóa tài khoản
4. Gán role (Admin/Staff/Accountant)
5. Quản lý trạng thái active/inactive
6. Auto-generate employee code (NV0001)

**Phân quyền:**
- Admin: Full access
- Staff: Inventory operations only
- Accountant: Reports và inventory view only

---

### UC10 – Quản lý thông tin cá nhân ✅
**Tác nhân:** Tất cả người dùng  
**Mục tiêu:** Cập nhật thông tin cá nhân  
**Luồng chính:**
1. Click avatar → "Thông tin cá nhân"
2. Xem thông tin hiện tại từ API
3. Cập nhật họ tên, email, số điện thoại
4. Đổi mật khẩu (optional)
5. Lưu thông tin với validation

**Tính năng:**
- Load data từ API thay vì localStorage
- Real-time validation
- Password strength check

---

## 3. Luồng dữ liệu chính

### 3.1. Inventory Flow
```
Nhập kho → InventoryTransaction (Import) → Update InventoryBalance → Dashboard Stats
Xuất kho → InventoryTransaction (Export) → Update InventoryBalance → Dashboard Stats
Kiểm kê → StockCheck (Approved) → InventoryTransaction (Adjustment) → Update InventoryBalance
```

### 3.2. User Management Flow
```
Login → JWT Token → Role-based Menu → Protected Routes → API Authorization
Profile Update → API Call → Database Update → UI Refresh
```

### 3.3. Search & Filter Flow
```
User Input → Debounced Search → Filter Data → Update UI → Pagination
Real-time → No API Call → Client-side Filtering → Instant Results
```

---

## 4. Tính năng nâng cao đã triển khai

### 4.1. Modular Architecture
- Tách components, hooks, utils cho mỗi module
- Reusable components (Table, Form, Search, Modal)
- Custom hooks cho state management
- Consistent code structure

### 4.2. User Experience
- Real-time search với debounce
- Loading states và error handling
- Confirmation dialogs cho actions quan trọng
- Responsive design
- Form validation với feedback

### 4.3. Performance Optimization
- Pagination cho large datasets
- Debounced search inputs
- Optimized MongoDB queries
- Client-side filtering khi có thể

### 4.4. Security Features
- JWT authentication
- Role-based access control
- Protected API routes
- Input validation và sanitization
- Password hashing với bcrypt

---

## 5. Integration Points

### 5.1. Frontend-Backend Integration
- RESTful API với consistent response format
- Error handling với user-friendly messages
- File upload cho future features
- Real-time updates potential

### 5.2. Database Integration
- MongoDB với Mongoose ODM
- Auto-generated IDs và codes
- Relationship management với populate
- Transaction consistency

---

## 6. Future Enhancements

### 6.1. Planned Features
- Barcode/QR code integration
- Mobile app cho warehouse staff
- Real-time notifications
- Advanced analytics dashboard
- Multi-warehouse support

### 6.2. Technical Improvements
- WebSocket cho real-time updates
- Redis caching layer
- Microservices architecture
- Docker containerization
- CI/CD pipeline