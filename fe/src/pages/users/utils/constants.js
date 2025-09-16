export const USER_ROLES = [
  { value: 'Admin', label: 'Quản trị viên', color: 'red' },
  { value: 'Staff', label: 'Nhân viên', color: 'blue' },
  { value: 'Accountant', label: 'Kế toán', color: 'green' }
];

export const FORM_RULES = {
  username: [
    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
  ],
  fullName: [
    { required: true, message: 'Vui lòng nhập họ tên' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email', message: 'Email không hợp lệ' }
  ],
  phone: [
    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
  ],
  role: [
    { required: true, message: 'Vui lòng chọn vai trò' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
  ]
};