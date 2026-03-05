'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Создаём пользователей с ignoreDuplicates
    await queryInterface.bulkInsert('users', [
      {
        id: 1,  // ← Явно указываем id для консистентности
        name: 'dispatcher',
        role: 'dispatcher',
        password: '123456',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'master1',
        role: 'master',
        password: '123456',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'master2',
        role: 'master',
        password: '123456',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { 
      ignoreDuplicates: true  // ← 🔑 КЛЮЧЕВАЯ ОПЦИЯ: пропускает дубликаты без ошибки
    });

    // ✅ Создаём заявки с ignoreDuplicates
    await queryInterface.bulkInsert('requests', [
      {
        id: 1,
        client_name: 'Иван Петров',
        phone: '+79991112233',
        address: 'ул. Ленина, 10, кв. 5',
        problem_text: 'Не работает розетка на кухне',
        status: 'new',
        assigned_to: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        client_name: 'Анна Сидорова',
        phone: '+79994445566',
        address: 'пр. Мира, 25, кв. 12',
        problem_text: 'Протекает кран в ванной',
        status: 'new',
        assigned_to: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        client_name: 'Ольга Иванова',
        phone: '+79997778899',
        address: 'ул. Гагарина, 5, кв. 30',
        problem_text: 'Сломался замок на входной двери',
        status: 'assigned',
        assigned_to: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        client_name: 'Дмитрий Козлов',
        phone: '+79990001122',
        address: 'ул. Пушкина, 15, кв. 8',
        problem_text: 'Не греет батарея в спальне',
        status: 'in_progress',
        assigned_to: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        client_name: 'Елена Морозова',
        phone: '+79993334455',
        address: 'пер. Садовый, 3, кв. 1',
        problem_text: 'Потекла труба под раковиной',
        status: 'done',
        assigned_to: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { 
      ignoreDuplicates: true  // ← 🔑 КЛЮЧЕВАЯ ОПЦИЯ: пропускает дубликаты без ошибки
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем данные при откате (без ignoreDuplicates — нужно удалить)
    await queryInterface.bulkDelete('requests', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};