// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, testConnection } = require('./config/database');

// Импортируем модели (для ассоциаций)
require('./models/index');

// Импортируем маршруты
const requestsRouter = require('./routes/requests');
const usersRouter = require('./routes/users');

// Создаём Express приложение
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/requests', requestsRouter);
app.use('/api/users', usersRouter);

// Root endpoint — приветственная страница
app.get('/', (req, res) => {
  res.json({
    message: '🛠️ Repair Service API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      users: 'GET /api/users',
      requests: 'GET /api/requests',
      docs: 'См. README.md'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Экспортируем app для тестов
module.exports = app;

// ✅ Запускаем сервер ТОЛЬКО если файл запущен напрямую (не импортирован)
if (require.main === module) {
  const start = async () => {
    try {
      await testConnection();
      
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
        console.log(`📋 API Endpoints:`);
        console.log(`   GET  /api/health`);
        console.log(`   GET  /api/users`);
        console.log(`   GET  /api/requests`);
        console.log(`   POST /api/requests`);
        console.log(`   POST /api/requests/:id/take`);
      });
    } catch (err) {
      console.error('❌ Ошибка запуска:', err);
      process.exit(1);
    }
  };
  
  start();
}