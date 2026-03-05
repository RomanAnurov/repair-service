const { User } = require('../models');

/**
 * Получить всех пользователей
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'role'] // Не возвращаем пароль!
    });

    res.json(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

/**
 * Получить пользователя по имени (для авторизации)
 * GET /api/users/by-name/:name
 */
const getUserByName = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({
      where: { name },
      attributes: ['id', 'name', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getAllUsers,
  getUserByName
};