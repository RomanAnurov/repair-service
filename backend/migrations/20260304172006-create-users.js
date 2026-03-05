'use strict';

module.exports = {
  // ✅ Правильно: создаём таблицу, индексы добавляем отдельно
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: Sequelize.ENUM('dispatcher', 'master'),
      allowNull: false,
      defaultValue: 'master'
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
  });

  // 👇 Индексы добавляем ОТДЕЛЬНО с уникальными именами
  await queryInterface.addIndex('users', ['role'], {
    name: 'idx_users_role'  // 👈 Явное имя индекса
  });
},

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};