// backend/tests/api.test.js
const request = require('supertest');
const app = require('../src/server'); // ✅ Импортируем app без запуска сервера

describe('API Tests', () => {
  
  // 🔹 ТЕСТ 1: Health check и получение пользователей
  test('GET /api/health и GET /api/users — базовые endpoints', async () => {
    // Health check
    const healthResponse = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(healthResponse.body.status).toBe('ok');
    
    // Пользователи
    const usersResponse = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(Array.isArray(usersResponse.body)).toBe(true);
    expect(usersResponse.body.length).toBeGreaterThanOrEqual(3);
    
    // Проверяем, что есть диспетчер
    const dispatcher = usersResponse.body.find(u => u.name === 'dispatcher');
    expect(dispatcher).toBeDefined();
    expect(dispatcher.role).toBe('dispatcher');
  });

  // 🔹 ТЕСТ 2: Создание заявки + проверка защиты от гонок
  test('POST /api/requests + race condition protection', async () => {
    // 1. Создаём новую заявку
    const newRequest = {
      clientName: 'Тестовый клиент',
      phone: '+79990000000',
      address: 'ул. Тестовая, 1',
      problemText: 'Тестовая проблема для автотеста'
    };

    const createResponse = await request(app)
      .post('/api/requests')
      .send(newRequest)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.status).toBe('new');
    const requestId = createResponse.body.id;

    // 2. Назначаем мастера (чтобы перевести в status: assigned)
    await request(app)
      .put(`/api/requests/${requestId}/assign`)
      .set('Authorization', 'dispatcher')
      .send({ masterId: 2 })
      .expect(200);

    // 3. 🔥 Тест на гонку: два мастера пытаются взять заявку одновременно
    const [response1, response2] = await Promise.all([
      request(app)
        .post(`/api/requests/${requestId}/take`)
        .set('Authorization', 'master1')
        .send({ masterId: 2 }),
      
      request(app)
        .post(`/api/requests/${requestId}/take`)
        .set('Authorization', 'master2')
        .send({ masterId: 3 })
    ]);

    // Один должен быть успешным (200), второй — конфликт (409)
    const statuses = [response1.status, response2.status].sort();
    expect(statuses).toEqual([200, 409]);

    // Проверяем, что в ответе 409 есть слово "Конфликт"
    const conflictResponse = [response1, response2].find(r => r.status === 409);
    expect(conflictResponse.body.error).toContain('Конфликт');

    // Проверяем финальный статус заявки
    const finalRequest = await request(app).get(`/api/requests/${requestId}`);
    expect(finalRequest.body.status).toBe('in_progress');
  });
});