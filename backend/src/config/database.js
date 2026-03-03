const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'repair_service',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    // Обязательно добавьте dialectOptions:
    dialectOptions: {
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      useUTC: false,
      timezone: '+03:00'
    },
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