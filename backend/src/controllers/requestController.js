const { Op } = require('sequelize');
const { Request, User } = require('../models');

/**
 * Создать новую заявку
 * POST /api/requests
 */
const createRequest = async (req, res) => {
  try {
    const { clientName, phone, address, problemText } = req.body;

    // Валидация обязательных полей
    if (!clientName || !phone || !address || !problemText) {
      return res.status(400).json({
        error: 'Все поля обязательны: clientName, phone, address, problemText'
      });
    }

    const request = await Request.create({
      clientName,
      phone,
      address,
      problemText,
      status: 'new',
      assignedTo: null
    });

    res.status(201).json(request);
  } catch (err) {
    console.error('Ошибка создания заявки:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получить все заявки (с фильтрацией по статусу)
 * GET /api/requests?status=new
 */
const getAllRequests = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (assignedTo) {
      where.assignedTo = parseInt(assignedTo);
    }

    const requests = await Request.findAll({
      where,
      include: [{
        model: User,
        as: 'master',
        attributes: ['id', 'name', 'role']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (err) {
    console.error('Ошибка получения заявок:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получить заявку по ID
 * GET /api/requests/:id
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id, {
      include: [{
        model: User,
        as: 'master',
        attributes: ['id', 'name', 'role']
      }]
    });

    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.json(request);
  } catch (err) {
    console.error('Ошибка получения заявки:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Назначить мастера на заявку (Диспетчер)
 * PUT /api/requests/:id/assign
 */
const assignMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { masterId } = req.body;

    if (!masterId) {
      return res.status(400).json({ error: 'masterId обязателен' });
    }

    // Проверка, что мастер существует
    const master = await User.findByPk(masterId);
    if (!master || master.role !== 'master') {
      return res.status(404).json({ error: 'Мастер не найден' });
    }

    // Проверка статуса заявки
    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    if (request.status !== 'new') {
      return res.status(409).json({ 
        error: 'Нельзя назначить мастера: заявка уже в работе',
        currentStatus: request.status
      });
    }

    // Обновляем заявку
    const [affected] = await Request.update(
      { 
        status: 'assigned',
        assignedTo: masterId,
        updatedAt: new Date()
      },
      { 
        where: { 
          id,
          status: 'new' // 🔒 Защита: обновляем только если статус ещё 'new'
        }
      }
    );

    if (affected === 0) {
      return res.status(409).json({ 
        error: 'Конфликт: заявка уже была назначена другому мастеру'
      });
    }

    const updatedRequest = await Request.findByPk(id, {
      include: [{ model: User, as: 'master', attributes: ['id', 'name'] }]
    });

    res.json(updatedRequest);
  } catch (err) {
    console.error('Ошибка назначения мастера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Взять заявку в работу (Мастер) — 🔐 ЗАЩИТА ОТ ГОНОК
 * POST /api/requests/:id/take
 */
const takeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const masterId = req.user?.id || req.body.masterId; // Из авторизации или тела запроса

    if (!masterId) {
      return res.status(400).json({ error: 'masterId обязателен' });
    }

    // 🔒 АТОМАРНОЕ обновление с проверкой статуса в WHERE
    // Это ключевой момент защиты от race conditions!
    const [affected] = await Request.update(
      { 
        status: 'in_progress',
        assignedTo: masterId,
        updatedAt: new Date()
      },
      { 
        where: { 
          id,
          status: 'assigned',      // 👈 Только если статус 'assigned'
          assignedTo: masterId     // 👈 И назначено на этого мастера
        }
      }
    );

    // Если ни одна строка не обновлена → конфликт!
    if (affected === 0) {
      // Проверяем текущее состояние заявки для понятного ответа
      const request = await Request.findByPk(id);
      
      if (!request) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }
      
      if (request.status === 'in_progress') {
        return res.status(409).json({ 
          error: 'Конфликт: заявка уже взята в работу другим мастером',
          currentStatus: request.status
        });
      }
      
      if (request.status !== 'assigned') {
        return res.status(409).json({ 
          error: `Конфликт: нельзя взять заявку со статусом ${request.status}`,
          currentStatus: request.status
        });
      }

      return res.status(409).json({ 
        error: 'Конфликт: заявка назначена другому мастеру',
        currentStatus: request.status,
        assignedTo: request.assignedTo
      });
    }

    // Возвращаем обновлённую заявку
    const updatedRequest = await Request.findByPk(id, {
      include: [{ model: User, as: 'master', attributes: ['id', 'name'] }]
    });

    res.json(updatedRequest);
  } catch (err) {
    console.error('Ошибка взятия заявки в работу:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Завершить заявку (Мастер)
 * POST /api/requests/:id/complete
 */
const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const masterId = req.user?.id || req.body.masterId;

    const [affected] = await Request.update(
      { 
        status: 'done',
        updatedAt: new Date()
      },
      { 
        where: { 
          id,
          status: 'in_progress',
          assignedTo: masterId
        }
      }
    );

    if (affected === 0) {
      const request = await Request.findByPk(id);
      if (!request) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }
      return res.status(409).json({ 
        error: 'Конфликт: нельзя завершить заявку',
        currentStatus: request.status
      });
    }

    const updatedRequest = await Request.findByPk(id);
    res.json(updatedRequest);
  } catch (err) {
    console.error('Ошибка завершения заявки:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Отменить заявку (Диспетчер)
 * POST /api/requests/:id/cancel
 */
const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [affected] = await Request.update(
      { 
        status: 'canceled',
        updatedAt: new Date()
      },
      { 
        where: { 
          id,
          status: { [Op.notIn]: ['done', 'canceled'] } // Нельзя отменить завершённые
        }
      }
    );

    if (affected === 0) {
      const request = await Request.findByPk(id);
      if (!request) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }
      return res.status(409).json({ 
        error: 'Нельзя отменить заявку',
        currentStatus: request.status
      });
    }

    const updatedRequest = await Request.findByPk(id);
    res.json(updatedRequest);
  } catch (err) {
    console.error('Ошибка отмены заявки:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  assignMaster,
  takeRequest,
  completeRequest,
  cancelRequest
};