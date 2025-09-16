export const getRoleLabel = (role) => {
  const roleMap = {
    'Admin': 'Quản trị viên',
    'Staff': 'Nhân viên kho',
    'Accountant': 'Kế toán'
  };
  return roleMap[role] || role;
};