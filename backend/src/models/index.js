const User = require('./User');
const Request = require('./Request');

// Настраиваем связи между моделями

// Мастер имеет много заявок
User.hasMany(Request, {
  foreignKey: 'assignedTo',
  as: 'assignedRequests',
  onDelete: 'SET NULL'
});


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