const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Модель User — представляет таблицу пользователей в БД
 * Роли: dispatcher (диспетчер), master (мастер)
 */
const User = sequelize.define('User', {
  // Поле id создаётся автоматически Sequelize
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,           // Имя пользователя должно быть уникальным
    validate: {
      notEmpty: { msg: 'Имя пользователя обязательно' },
      len: {
        args: [3, 50],
        msg: 'Имя должно быть от 3 до 50 символов'
      }
    }
  },
  
  role: {
    type: DataTypes.ENUM('dispatcher', 'master'), // Только эти два значения
    allowNull: false,
    defaultValue: 'master',
    validate: {
      isIn: {
        args: [['dispatcher', 'master']],
        msg: 'Роль должна быть dispatcher или master'
      }
    }
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Пароль обязателен' },
      len: {
        args: [6, 100],
        msg: 'Пароль должен быть минимум 6 символов'
      }
    }
  }
  
  // createdAt и updatedAt добавятся автоматически (timestamps: true)
  
}, {
  tableName: 'users',       // Имя таблицы в БД
  timestamps: true,         // Автоматически добавлять createdAt/updatedAt
  underscored: true,        // Использовать snake_case: created_at вместо createdAt
  indexes: [
    { fields: ['name'], unique: true },  // Индекс для быстрого поиска по имени
    { fields: ['role'] }                  // Индекс для фильтрации по роли
  ]
});

module.exports = User;