require('dotenv').config();
const { sequelize } = require('./config/database');
const User = require('./models/User');
const Request = require('./models/Request');

// Импортируем ассоциации
require('./models/index');

const seed = async () => {
  const t = await sequelize.transaction();
  
  try {
    // 1. Синхронизируем модели (создаём таблицы)
    await sequelize.sync({ alter: true, force: false });
    console.log('✅ Таблицы созданы/обновлены');
    
    // 2. Очищаем старые данные (опционально, для чистоты тестов)
    await Request.destroy({ where: {}, transaction: t });
    await User.destroy({ where: {}, transaction: t });
    console.log('🗑️  Старые данные очищены');
    
    // 3. Создаём пользователей
    const users = await User.bulkCreate([
      { 
        name: 'dispatcher', 
        role: 'dispatcher', 
        password: '123456' 
      },
      { 
        name: 'master1', 
        role: 'master', 
        password: '123456' 
      },
      { 
        name: 'master2', 
        role: 'master', 
        password: '123456' 
      }
    ], { transaction: t });
    
    console.log(`✅ Создано пользователей: ${users.length}`);
    console.log('   - dispatcher (id: 1)');
    console.log('   - master1 (id: 2)');
    console.log('   - master2 (id: 3)');
    
    // 4. Создаём тестовые заявки
    const requests = await Request.bulkCreate([
      {
        clientName: 'Иван Петров',
        phone: '+79991112233',
        address: 'ул. Ленина, 10, кв. 5',
        problemText: 'Не работает розетка на кухне. Искрит при включении приборов.',
        status: 'new',
        assignedTo: null
      },
      {
        clientName: 'Анна Сидорова',
        phone: '+79994445566',
        address: 'пр. Мира, 25, кв. 12',
        problemText: 'Протекает кран в ванной. Капает постоянно, уже лужа.',
        status: 'new',
        assignedTo: null
      },
      {
        clientName: 'Ольга Иванова',
        phone: '+79997778899',
        address: 'ул. Гагарина, 5, кв. 30',
        problemText: 'Сломался замок на входной двери. Ключ не поворачивается.',
        status: 'assigned',
        assignedTo: 2 // master1 (id: 2)
      },
      {
        clientName: 'Дмитрий Козлов',
        phone: '+79990001122',
        address: 'ул. Пушкина, 15, кв. 8',
        problemText: 'Не греет батарея в спальне. Холодно, нужно проверить.',
        status: 'in_progress',
        assignedTo: 2 // master1 (id: 2)
      },
      {
        clientName: 'Елена Морозова',
        phone: '+79993334455',
        address: 'пер. Садовый, 3, кв. 1',
        problemText: 'Потекла труба под раковиной. Срочно нужен мастер!',
        status: 'done',
        assignedTo: 3 // master2 (id: 3)
      }
    ], { transaction: t });
    
    console.log(`✅ Создано заявок: ${requests.length}`);
    console.log('   - new: 2 заявки');
    console.log('   - assigned: 1 заявка');
    console.log('   - in_progress: 1 заявка');
    console.log('   - done: 1 заявка');
    
    // 5. Коммитим транзакцию
    await t.commit();
    console.log('✅ Сиды выполнены успешно');
    
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('❌ Ошибка сидов:', err.message);
    console.error(err);
    process.exit(1);
  }
};

seed();