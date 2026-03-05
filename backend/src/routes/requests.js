const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
  assignMaster,
  takeRequest,
  completeRequest,
  cancelRequest
} = require('../controllers/requestController');

// Простая авторизация (заглушка для тестового задания)
const simpleAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Формат: "master1" или "dispatcher"
    req.user = { name: authHeader, id: authHeader === 'master1' ? 2 : authHeader === 'master2' ? 3 : 1 };
  }
  next();
};

// CRUD для заявок
router.post('/', createRequest);           // Создать заявку
router.get('/', getAllRequests);           // Получить все заявки
router.get('/:id', getRequestById);        // Получить заявку по ID

// Действия с заявками
router.put('/:id/assign', simpleAuth, assignMaster);      // Назначить мастера
router.post('/:id/take', simpleAuth, takeRequest);        // Взять в работу 🔐
router.post('/:id/complete', simpleAuth, completeRequest); // Завершить
router.post('/:id/cancel', simpleAuth, cancelRequest);    // Отменить

module.exports = router;