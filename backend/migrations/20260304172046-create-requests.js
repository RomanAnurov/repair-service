'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      client_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      problem_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('new', 'assigned', 'in_progress', 'done', 'canceled'),
        allowNull: false,
        defaultValue: 'new'
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Индексы для фильтрации
    // В migrations/*-create-requests.js
await queryInterface.addIndex('requests', ['status'], {
  name: 'idx_requests_status'
});
await queryInterface.addIndex('requests', ['assigned_to'], {
  name: 'idx_requests_assigned_to'
});
await queryInterface.addIndex('requests', ['created_at'], {
  name: 'idx_requests_created_at'
});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requests');
  }
};