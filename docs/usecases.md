# Use Cases – Hệ thống Quản lý Kho hàng

## 1. Danh sách tác nhân (Actors)
- **Admin (Quản trị viên)**: Quản lý hệ thống, phân quyền, báo cáo.
- **Nhân viên kho (Staff)**: Nhập kho, xuất kho, kiểm kê, tra cứu tồn kho.
- **Kế toán (Accountant)**: Xem báo cáo nhập – xuất – tồn, kiểm soát chi phí.
- **Nhà cung cấp (Supplier)**: Đối tượng liên quan trong nhập kho.
- **Khách hàng (Customer)**: Đối tượng liên quan trong xuất kho.

---

## 2. Use Case chính

### UC01 – Quản lý sản phẩm
**Tác nhân:** Admin, Nhân viên kho  
**Mục tiêu:** Quản lý thông tin sản phẩm trong kho.  
**Luồng chính:**
1. Người dùng chọn chức năng “Quản lý sản phẩm”.
2. Thêm/sửa/xóa sản phẩm (mã, tên, đơn vị, giá nhập, giá bán, vị trí, hạn sử dụng).
3. Hệ thống lưu và cập nhật dữ liệu.
4. Người dùng có thể tra cứu theo mã/tên/nhóm hàng.

**Ngoại lệ:**
- Nếu nhập thiếu trường bắt buộc → hệ thống báo lỗi.

---

### UC02 – Nhập kho
**Tác nhân:** Nhân viên kho, Nhà cung cấp  
**Mục tiêu:** Ghi nhận hàng hóa nhập từ NCC.  
**Luồng chính:**
1. Nhân viên kho chọn “Nhập kho”.
2. Tạo phiếu nhập: mã phiếu, ngày, NCC, danh sách sản phẩm, số lượng, đơn giá.
3. Hệ thống kiểm tra dữ liệu.
4. Hệ thống lưu phiếu nhập và cập nhật tồn kho.
5. Lưu lịch sử giao dịch.

**Ngoại lệ:**
- Sản phẩm chưa tồn tại → yêu cầu thêm mới trước.
- Nhập dữ liệu sai định dạng → cảnh báo.

---

### UC03 – Xuất kho
**Tác nhân:** Nhân viên kho, Khách hàng  
**Mục tiêu:** Xuất hàng cho đơn hàng hoặc yêu cầu nội bộ.  
**Luồng chính:**
1. Nhân viên chọn “Xuất kho”.
2. Tạo phiếu xuất: mã phiếu, ngày, sản phẩm, số lượng, khách hàng/đơn hàng.
3. Hệ thống kiểm tra tồn kho.
4. Nếu đủ → tạo phiếu xuất, trừ tồn, lưu lịch sử.
5. Cập nhật trạng thái đơn hàng.

**Ngoại lệ:**
- Nếu tồn kho không đủ → cảnh báo “thiếu hàng”.
- Nếu đơn hàng bị hủy → không cho xuất.

---

### UC04 – Quản lý tồn kho
**Tác nhân:** Nhân viên kho, Quản lý  
**Mục tiêu:** Tra cứu và theo dõi tồn kho.  
**Luồng chính:**
1. Người dùng chọn “Xem tồn kho”.
2. Hệ thống hiển thị danh sách sản phẩm và số lượng tồn.
3. Người dùng có thể lọc theo mã, tên, vị trí, lô.
4. Hệ thống hiển thị cảnh báo tồn thấp, hàng sắp hết hạn.

**Ngoại lệ:**
- Nếu dữ liệu tồn không khớp → yêu cầu kiểm kê.

---

### UC05 – Kiểm kê kho
**Tác nhân:** Nhân viên kho, Quản lý  
**Mục tiêu:** Đối chiếu tồn kho thực tế với hệ thống.  
**Luồng chính:**
1. Nhân viên kho chọn “Kiểm kê”.
2. Nhập số lượng thực tế từng sản phẩm.
3. Hệ thống so sánh với dữ liệu hệ thống.
4. Nếu khớp → tạo biên bản kiểm kê.
5. Nếu lệch → tạo biên bản chênh lệch, gửi quản lý duyệt.
6. Quản lý duyệt → hệ thống điều chỉnh tồn kho.

**Ngoại lệ:**
- Nếu nhân viên không có quyền → không thể điều chỉnh.

---

### UC06 – Báo cáo & Thống kê
**Tác nhân:** Admin, Kế toán  
**Mục tiêu:** Theo dõi tình hình kho.  
**Luồng chính:**
1. Người dùng chọn “Báo cáo”.
2. Hệ thống tạo báo cáo nhập – xuất – tồn, hàng sắp hết, hàng hết hạn, giá trị hàng tồn.
3. Người dùng có thể xem online hoặc export PDF/Excel.

**Ngoại lệ:**
- Nếu không có dữ liệu phù hợp → thông báo “không có dữ liệu”.

---

### UC07 – Quản trị hệ thống
**Tác nhân:** Admin  
**Mục tiêu:** Quản lý người dùng, phân quyền.  
**Luồng chính:**
1. Admin chọn “Quản trị hệ thống”.
2. Thêm/sửa/xóa tài khoản người dùng.
3. Gán vai trò (Admin, Nhân viên kho, Kế toán).
4. Hệ thống lưu thông tin và cập nhật phân quyền.

**Ngoại lệ:**
- Không được phép xóa tài khoản Admin cuối cùng.

---

## 3. Tổng hợp luồng dữ liệu
- **Nhập kho** → Cập nhật tồn kho → Ghi lịch sử → Báo cáo.  
- **Xuất kho** → Cập nhật tồn kho → Ghi lịch sử → Báo cáo.  
- **Kiểm kê** → So sánh số liệu → Điều chỉnh tồn kho → Báo cáo.  
- **Quản lý sản phẩm** → Cập nhật thông tin sản phẩm → Áp dụng cho nhập/xuất.  

---
