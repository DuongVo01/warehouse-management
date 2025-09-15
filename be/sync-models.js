const { sequelize } = require('./config/database-sqlite');
require('./models');

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Sync models với force: false để không xóa dữ liệu
    await sequelize.sync({ alter: true });
    console.log('Models synced successfully');
  } catch (error) {
    console.error('Error syncing models:', error.message);
  } finally {
    await sequelize.close();
  }
}

syncModels();