require('dotenv').config();
const { sequelize } = require('./config/database');

const migrate = async () => {
  try {
    // Синхронизация моделей с БД (создаёт таблицы)
    await sequelize.sync({ alter: true, force: false });
    console.log('✅ Миграции выполнены успешно');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка миграции:', err.message);
    process.exit(1);
  }
};

migrate();