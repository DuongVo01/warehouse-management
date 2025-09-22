# Frontend - Hệ thống quản lý kho hàng

Frontend của hệ thống quản lý kho hàng được xây dựng với React.js, cung cấp giao diện người dùng hiện đại và thân thiện để quản lý các hoạt động kho hàng một cách hiệu quả.

## 📋 Tóm tắt về Frontend

Frontend cung cấp:
- Giao diện quản lý trực quan và dễ sử dụng
- Dashboard với biểu đồ và thống kê real-time
- Quản lý sản phẩm với upload hình ảnh
- Theo dõi nhập/xuất kho chi tiết
- Hệ thống báo cáo đa dạng
- Phân quyền người dùng theo vai trò
- Responsive design cho mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Framework**: React.js 18.2.0
- **UI Library**: Ant Design 5.2.0
- **Routing**: React Router DOM 6.8.0
- **HTTP Client**: Axios 1.3.0
- **Charts**: Recharts 3.2.1
- **State Management**: Zustand 4.3.0
- **Date Handling**: Day.js 1.11.0
- **PDF Generation**: jsPDF 3.0.2
- **Icons**: Ant Design Icons 5.0.0
- **Fonts**: Roboto Font 5.2.7

## 📦 Cài đặt Dependencies

```bash
# Di chuyển vào thư mục frontend
cd fe

# Cài đặt dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

### Dependencies chính:
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "antd": "^5.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0",
  "recharts": "^3.2.1",
  "zustand": "^4.3.0",
  "dayjs": "^1.11.0",
  "jspdf": "^3.0.2"
}
```

## 🚀 Chạy Server Development

### Development Mode
```bash
# Chạy development server
npm start

# Hoặc
yarn start

# Hoặc sử dụng script dev
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### Scripts có sẵn:
```json
{
  "start": "react-scripts start",
  "dev": "react-scripts start", 
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

### Development Features:
- **Hot Reload**: Tự động reload khi có thay đổi code
- **Error Overlay**: Hiển thị lỗi trực tiếp trên browser
- **Source Maps**: Debug dễ dàng với source maps
- **Fast Refresh**: Giữ state khi reload components

## 🏗️ Build cho Production

### Build Production
```bash
# Tạo build production
npm run build

# Hoặc
yarn build
```

### Kết quả build:
- Thư mục `build/` chứa files đã được optimize
- CSS và JS được minify và bundle
- Assets được optimize và có hash
- Service worker được tạo tự động

### Deploy Production:
```bash
# Serve static files (sử dụng serve)
npm install -g serve
serve -s build -l 3000

# Hoặc deploy lên hosting platforms:
# - Netlify: drag & drop thư mục build/
# - Vercel: vercel --prod
# - GitHub Pages: npm run deploy
```

### Environment Variables:
Tạo file `.env` trong thư mục `fe/`:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration  
REACT_APP_NAME=Warehouse Management System
REACT_APP_VERSION=1.0.0

# Production
# REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🔗 Kết nối với Backend API

### Cấu hình API Base URL
```javascript
// src/services/api/config.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default API_URL;
```

### Axios Configuration
```javascript
// src/services/api/authAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Services Structure:
```javascript
// src/services/api/
├── authAPI.js          # Authentication APIs
├── productAPI.js       # Product management APIs  
├── inventoryAPI.js     # Inventory operations APIs
├── userAPI.js          # User management APIs
├── supplierAPI.js      # Supplier management APIs
└── reportAPI.js        # Reporting APIs
```

### Sử dụng API trong Components:
```javascript
// Example: src/pages/products/ProductList.jsx
import { productAPI } from '../../services/api/productAPI';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    // Component JSX
  );
};
```

## 📁 Cấu trúc thư mục chi tiết

```
fe/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   ├── favicon.ico        # App icon
│   └── manifest.json      # PWA manifest
├── src/
│   ├── assets/            # Static resources
│   │   └── styles/        # Global CSS/SCSS
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── layouts/           # Layout components
│   │   └── MainLayout.jsx # Main app layout
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard & analytics
│   │   │   ├── components/    # Dashboard components
│   │   │   ├── hooks/         # Dashboard hooks
│   │   │   └── Dashboard.jsx  # Main dashboard
│   │   ├── inventory/     # Inventory management
│   │   ├── products/      # Product management
│   │   ├── reports/       # Reporting system
│   │   ├── suppliers/     # Supplier management
│   │   └── users/         # User management
│   ├── services/          # API services
│   │   └── api/           # API endpoints
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── index.js           # Entry point
├── package.json           # Dependencies & scripts
└── README.md             # This file
```

## 🎨 UI/UX Guidelines

### Ant Design Theme:
```javascript
// src/App.jsx
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      {/* App content */}
    </ConfigProvider>
  );
}
```

### Responsive Breakpoints:
- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Small tablet)
- **md**: ≥ 768px (Tablet)
- **lg**: ≥ 992px (Desktop)
- **xl**: ≥ 1200px (Large desktop)

## 🔒 Authentication Flow

### Protected Routes:
```javascript
// src/components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### Role-based Access:
- **Admin**: Toàn quyền truy cập
- **Staff**: Quản lý sản phẩm, nhập/xuất kho
- **Accountant**: Xem báo cáo và thống kê

## 🧪 Testing

```bash
# Chạy tests
npm test

# Test với coverage
npm run test:coverage

# Test watch mode
npm test -- --watch
```

## 🚀 Performance Optimization

### Code Splitting:
```javascript
// Lazy loading components
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
```

### Bundle Analysis:
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🐛 Common Issues & Solutions

### 1. CORS Error
```javascript
// Đảm bảo backend có cấu hình CORS đúng
// Hoặc sử dụng proxy trong package.json
"proxy": "http://localhost:5000"
```

### 2. Build Error
```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. Environment Variables
```bash
# Đảm bảo biến môi trường có prefix REACT_APP_
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 PWA Features

Ứng dụng hỗ trợ Progressive Web App:
- **Offline capability**: Hoạt động khi mất mạng
- **Install prompt**: Cài đặt như native app
- **Push notifications**: Thông báo real-time
- **Background sync**: Đồng bộ dữ liệu nền