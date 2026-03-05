require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'repair_service',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    
    // ✅ dialectOptions — только connectTimeout
    dialectOptions: {
      connectTimeout: 60000
    },
    
    // ✅ Кодировка на верхнем уровне (важно!)
    charset: 'utf8mb4',
    
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ БД подключена успешно');
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };