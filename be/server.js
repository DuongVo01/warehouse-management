const express = require('express');
const connectDB = require('./config/database-mongodb');
const envConfig = require('./config/env');
const logger = require('./config/logger');
const { errorHandler, notFound, requestLogger } = require('./middleware');

// Import routes
const routes = require('./routes');
const NotificationJob = require('./jobs/notificationJob');

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

// Static files - serve uploaded files
app.use('/uploads', express.static('uploads'));

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

    // Start notification jobs
    NotificationJob.start();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server đang chạy trên port ${PORT}`);
      logger.info(`API endpoint: http://localhost:${PORT}/api`);
      logger.info('Notification jobs started');
    });
  } catch (error) {
    logger.error('Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer();