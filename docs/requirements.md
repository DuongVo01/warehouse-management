# Requirements – Hệ thống Quản lý Kho hàng

## 1. Giới thiệu
- **Tên hệ thống**: Warehouse Management System (WMS)  
- **Mục tiêu**: Hỗ trợ doanh nghiệp quản lý hoạt động nhập – xuất – tồn kho, giảm thất thoát, tối ưu vận hành.  
- **Người dùng chính**:
  - Quản trị viên (Admin)
  - Nhân viên kho
  - Kế toán
  - Bộ phận mua hàng / bán hàng (gián tiếp)

---

## 2. Phạm vi
Hệ thống phục vụ:
- Quản lý thông tin sản phẩm, nhà cung cấp.
- Quản lý nhập kho, xuất kho, kiểm kê.
- Theo dõi tồn kho theo thời gian thực.
- Sinh báo cáo phục vụ quản lý và kế toán.

Không bao gồm:
- Bán hàng trực tuyến.
- Tích hợp thanh toán điện tử.

---

## 3. Yêu cầu chức năng

### 3.1. Quản lý sản phẩm
- Thêm / sửa / xóa sản phẩm.
- Quản lý thuộc tính: mã sản phẩm, tên, đơn vị tính, giá nhập, giá bán, hạn sử dụng, vị trí kệ.
- Tra cứu sản phẩm theo mã, tên, nhóm hàng.

### 3.2. Nhập kho
- Tạo phiếu nhập kho (mã phiếu, ngày, NCC, sản phẩm, số lượng, đơn giá, hạn sử dụng).
- Cập nhật tồn kho khi nhập.
- Ghi nhận lịch sử nhập kho.
- Cảnh báo khi nhập sản phẩm mới chưa có trong danh mục.

### 3.3. Xuất kho
- Tạo phiếu xuất kho (mã phiếu, ngày, khách hàng/đơn hàng, sản phẩm, số lượng).
- Kiểm tra tồn kho trước khi xuất.
- Cập nhật tồn kho khi xuất.
- Ghi nhận lịch sử xuất kho.

### 3.4. Quản lý tồn kho
- Theo dõi số lượng tồn theo thời gian thực.
- Tra cứu tồn theo sản phẩm, vị trí, lô hàng.
- Cảnh báo tồn kho thấp hoặc hàng sắp hết hạn.

### 3.5. Kiểm kê kho
- Tạo phiếu kiểm kê.
- Nhập số lượng thực tế, so sánh với dữ liệu hệ thống.
- Ghi nhận chênh lệch, lập biên bản kiểm kê.
- Cập nhật tồn kho sau khi quản lý duyệt.

### 3.6. Báo cáo & Thống kê
- Báo cáo nhập – xuất – tồn theo ngày/tháng/năm.
- Báo cáo hàng sắp hết, hàng sắp hết hạn.
- Báo cáo giá trị hàng tồn kho.
- Xuất báo cáo ra Excel/PDF.

### 3.7. Quản trị hệ thống
- Quản lý người dùng, phân quyền theo vai trò (Admin, Nhân viên kho, Kế toán).
- Quản lý danh mục nhà cung cấp.
- Sao lưu / phục hồi dữ liệu.

---

## 4. Yêu cầu phi chức năng
- **Hiệu năng**: phản hồi thao tác dưới 2 giây cho nghiệp vụ cơ bản.  
- **Bảo mật**: phân quyền truy cập theo tài khoản.  
- **Khả năng mở rộng**: hỗ trợ tăng số lượng sản phẩm, người dùng.  
- **Khả dụng**: hệ thống online 24/7, downtime < 1%/tháng.  
- **Khả năng tích hợp**: có thể mở rộng API kết nối hệ thống bán hàng/ERP.  

---

## 5. Ràng buộc
- Hệ thống sử dụng cơ sở dữ liệu quan hệ (MySQL/PostgreSQL).  
- Giao diện web, hỗ trợ trên trình duyệt Chrome/Edge/Firefox.  
- Ngôn ngữ hiển thị: Tiếng Việt (có thể mở rộng đa ngôn ngữ).  

---

## 6. Ưu tiên phát triển (MVP trước)
1. Nhập kho, xuất kho, tồn kho theo thời gian thực.  
2. Quản lý sản phẩm, nhà cung cấp.  
3. Báo cáo nhập – xuất – tồn cơ bản.  
4. Quản lý người dùng & phân quyền.  

---

## 7. Tương lai mở rộng
- Tích hợp barcode/QR code khi nhập – xuất hàng.  
- Mobile app cho nhân viên kho.  
- Tích hợp IoT (cảm biến nhiệt độ, theo dõi container).  
- Kết nối với hệ thống bán hàng để tự động đồng bộ đơn hàng.  

---
