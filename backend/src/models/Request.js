const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Модель Request — представляет таблицу заявок в БД
 * Статусы: new, assigned, in_progress, done, canceled
 */
const Request = sequelize.define('Request', {
  // Поле id создаётся автоматически Sequelize
  
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Имя клиента обязательно' },
      len: {
        args: [2, 100],
        msg: 'Имя клиента от 2 до 100 символов'
      }
    }
  },
  
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Телефон обязателен' },
      is: {
        args: /^[\d\s\+\-\(\)]+$/i,
        msg: 'Неверный формат телефона'
      }
    }
  },
  
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Адрес обязателен' },
      len: {
        args: [5, 200],
        msg: 'Адрес от 5 до 200 символов'
      }
    }
  },
  
  problemText: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Описание проблемы обязательно' },
      len: {
        args: [10, 1000],
        msg: 'Описание от 10 до 1000 символов'
      }
    }
  },
  
  status: {
    type: DataTypes.ENUM('new', 'assigned', 'in_progress', 'done', 'canceled'),
    allowNull: false,
    defaultValue: 'new',
    validate: {
      isIn: {
        args: [['new', 'assigned', 'in_progress', 'done', 'canceled']],
        msg: 'Неверный статус заявки'
      }
    }
  },
  
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'ID мастера, назначенного на заявку (NULL если не назначен)'
    // Внешний ключ на User будет настроен через ассоциацию
  }
  
  // createdAt и updatedAt добавятся автоматически
  
}, {
  tableName: 'requests',    // Имя таблицы в БД
  timestamps: true,         // Автоматически добавлять createdAt/updatedAt
  underscored: true,        // Использовать snake_case: created_at вместо createdAt
  indexes: [
    { fields: ['status'] },           // Индекс для фильтрации по статусу
    { fields: ['assigned_to'] },      // Индекс для поиска заявок мастера
    { fields: ['created_at'] }        // Индекс для сортировки по дате
  ]
});

module.exports = Request;