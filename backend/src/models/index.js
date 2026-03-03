const User = require('./User');
const Request = require('./Request');

/**
 * Настраиваем связи между моделями
 * 
 * Один мастер (User) → Много заявок (Request)
 * Одна заявка (Request) → Один мастер (User)
 */

// Мастер имеет много заявок (assignedTo ссылается на User.id)
User.hasMany(Request, {
  foreignKey: 'assignedTo',
  as: 'assignedRequests',
  onDelete: 'SET NULL'  // Если мастера удалили, заявки остаются с NULL
});

// Заявка принадлежит одному мастеру
Request.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'master',
  onDelete: 'SET NULL'
});

module.exports = {
  User,
  Request,
  sequelize: require('../config/database').sequelize
};