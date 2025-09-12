# Database Design – Hệ thống Quản lý Kho hàng

## 1. Nguyên tắc thiết kế
- Dữ liệu quan hệ, chuẩn hóa (3NF) để tránh trùng lặp.  
- Mỗi bảng có khóa chính (Primary Key).  
- Khóa ngoại (Foreign Key) để ràng buộc quan hệ.  
- Lưu lịch sử thay đổi (audit) qua bảng giao dịch.  

---

## 2. Danh sách bảng dữ liệu chính

### 2.1. Bảng Users (Người dùng)
| Trường        | Kiểu dữ liệu   | Mô tả                           |
|---------------|----------------|---------------------------------|
| UserID (PK)   | INT, AUTO      | Mã người dùng                   |
| Username      | VARCHAR(50)    | Tên đăng nhập                   |
| PasswordHash  | VARCHAR(255)   | Mật khẩu (hash)                 |
| FullName      | VARCHAR(100)   | Họ và tên                       |
| Role          | ENUM(Admin, Staff, Accountant) | Vai trò |
| Email         | VARCHAR(100)   | Email                           |
| Phone         | VARCHAR(20)    | Số điện thoại                   |
| CreatedAt     | DATETIME       | Ngày tạo                        |
| IsActive      | BOOLEAN        | Trạng thái hoạt động            |

---

### 2.2. Bảng Suppliers (Nhà cung cấp)
| Trường        | Kiểu dữ liệu   | Mô tả                |
|---------------|----------------|----------------------|
| SupplierID(PK)| INT, AUTO      | Mã nhà cung cấp      |
| Name          | VARCHAR(100)   | Tên nhà cung cấp     |
| Address       | VARCHAR(255)   | Địa chỉ              |
| Phone         | VARCHAR(20)    | SĐT                  |
| Email         | VARCHAR(100)   | Email                |
| TaxCode       | VARCHAR(50)    | Mã số thuế           |
| CreatedAt     | DATETIME       | Ngày thêm            |

---

### 2.3. Bảng Products (Sản phẩm)
| Trường         | Kiểu dữ liệu   | Mô tả                           |
|----------------|----------------|---------------------------------|
| ProductID (PK) | INT, AUTO      | Mã sản phẩm                     |
| SKU            | VARCHAR(50)    | Mã hàng (Stock Keeping Unit)    |
| Name           | VARCHAR(150)   | Tên sản phẩm                    |
| Unit           | VARCHAR(20)    | Đơn vị tính (cái, hộp, thùng)   |
| CostPrice      | DECIMAL(18,2)  | Giá nhập                        |
| SalePrice      | DECIMAL(18,2)  | Giá bán                         |
| ExpiryDate     | DATE, NULLABLE | Hạn sử dụng (nếu có)            |
| Location       | VARCHAR(50)    | Vị trí kệ trong kho             |
| CreatedAt      | DATETIME       | Ngày thêm                       |
| IsActive       | BOOLEAN        | Trạng thái sản phẩm             |

---

### 2.4. Bảng InventoryTransactions (Giao dịch tồn kho)
| Trường              | Kiểu dữ liệu   | Mô tả                                        |
|---------------------|----------------|----------------------------------------------|
| TransactionID (PK)  | INT, AUTO      | Mã giao dịch tồn kho                         |
| ProductID (FK)      | INT            | Sản phẩm liên quan                           |
| TransactionType     | ENUM(Import, Export, Adjust) | Loại giao dịch (Nhập, Xuất, Điều chỉnh) |
| Quantity            | INT            | Số lượng thay đổi                            |
| UnitPrice           | DECIMAL(18,2)  | Giá trị đơn vị (nếu có)                      |
| SupplierID (FK)     | INT, NULLABLE  | Nhà cung cấp (cho nhập kho)                  |
| CustomerInfo        | VARCHAR(255)   | Thông tin khách (cho xuất kho)               |
| Note                | VARCHAR(255)   | Ghi chú giao dịch                            |
| CreatedBy (FK)      | INT            | Người thao tác                               |
| CreatedAt           | DATETIME       | Thời điểm giao dịch                          |

---

### 2.5. Bảng InventoryBalance (Số dư tồn kho)
| Trường        | Kiểu dữ liệu   | Mô tả                           |
|---------------|----------------|---------------------------------|
| ProductID(PK,FK)| INT          | Sản phẩm                        |
| Quantity       | INT            | Số lượng tồn hiện tại           |
| LastUpdated    | DATETIME       | Ngày cập nhật gần nhất          |

> Ghi chú: Bảng này lưu **số lượng hiện tại**, được cập nhật tự động sau mỗi giao dịch từ `InventoryTransactions`.

---

### 2.6. Bảng StockCheck (Kiểm kê kho)
| Trường        | Kiểu dữ liệu   | Mô tả                           |
|---------------|----------------|---------------------------------|
| StockCheckID(PK)| INT, AUTO    | Mã phiếu kiểm kê                |
| ProductID(FK) | INT            | Sản phẩm                        |
| SystemQty     | INT            | Số lượng theo hệ thống          |
| ActualQty     | INT            | Số lượng kiểm kê thực tế        |
| Difference    | INT            | Chênh lệch                      |
| CreatedBy(FK) | INT            | Người lập phiếu kiểm kê         |
| CreatedAt     | DATETIME       | Ngày kiểm kê                    |
| ApprovedBy(FK)| INT, NULLABLE  | Quản lý duyệt                   |
| Status        | ENUM(Pending, Approved, Rejected) | Trạng thái |

---

### 2.7. Bảng Reports (Lưu báo cáo xuất/nhập/tồn)
| Trường         | Kiểu dữ liệu   | Mô tả                           |
|----------------|----------------|---------------------------------|
| ReportID (PK)  | INT, AUTO      | Mã báo cáo                      |
| ReportType     | ENUM(Import, Export, Inventory, Expiry, LowStock) | Loại báo cáo |
| FilePath       | VARCHAR(255)   | Đường dẫn file (Excel/PDF)      |
| CreatedBy (FK) | INT            | Người tạo báo cáo               |
| CreatedAt      | DATETIME       | Ngày tạo                        |

---

## 3. Quan hệ giữa các bảng
- **Users** (1 - n) → **InventoryTransactions**, **StockCheck**, **Reports**  
- **Suppliers** (1 - n) → **InventoryTransactions** (cho nhập kho)  
- **Products** (1 - n) → **InventoryTransactions**, **StockCheck**, **InventoryBalance**  

---

## 4. Ghi chú thiết kế
- Các trường `CreatedAt` lưu theo UTC để đồng bộ.  
- Có thể bổ sung bảng **Customers** nếu quản lý xuất kho cho khách hàng chi tiết.  
- Tích hợp trigger DB để:
  - Sau khi nhập/xuất (`InventoryTransactions`) → update tồn (`InventoryBalance`).  
  - Khi kiểm kê Approved → update tồn.  

---
