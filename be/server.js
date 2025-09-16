const express = require('express');
const connectDB = require('./config/database-mongodb');
const envConfig = require('./config/env');
const logger = require('./config/logger');
const { errorHandler, notFound, requestLogger } = require('./middleware');

// Import routes
const routes = require('./routes');

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Kết nối database
    await connectDB();
    
    // Tạo thư mục reports nếu chưa có
    const fs = require('fs');
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports', { recursive: true });
    }

    // Start server
    app.listen(3000, () => {
      logger.info('Server đang chạy trên port 3000');
      logger.info('API endpoint: http://localhost:3000/api');
    });
  } catch (error) {
    logger.error('Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer();