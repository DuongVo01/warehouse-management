import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductList from './pages/products/ProductList';
import InventoryImport from './pages/inventory/InventoryImport';
import InventoryExport from './pages/inventory/InventoryExport';
import StockBalance from './pages/inventory/StockBalance';
import StockCheck from './pages/inventory/StockCheck';
import SupplierList from './pages/suppliers/SupplierList';
import ReportList from './pages/reports/ReportList';
import UserList from './pages/users/UserList';
import Categories from './pages/categories/Categories';
import Profile from './pages/profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/" element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
          }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path="inventory/import" element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <InventoryImport />
              </ProtectedRoute>
            } />
            <Route path="inventory/export" element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <InventoryExport />
              </ProtectedRoute>
            } />
            <Route path="inventory/balance" element={<StockBalance />} />
            <Route path="inventory/check" element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <StockCheck />
              </ProtectedRoute>
            } />
            <Route path="suppliers" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SupplierList />
              </ProtectedRoute>
            } />
            <Route path="categories" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute allowedRoles={['Admin', 'Accountant']}>
                <ReportList />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;