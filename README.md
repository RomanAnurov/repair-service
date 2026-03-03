# 🛠️ Веб-сервис "Заявки в ремонтную службу"

## 📋 Описание
Веб-приложение для приёма и обработки заявок в ремонтную службу.

## 🚀 Быстрый старт

### Вариант A: Docker Compose (рекомендуется)
```bash
docker-compose up --build


Приложение доступно:
Фронтенд: http://localhost:3000
Бэкенд: http://localhost:3001


Вариант B: Локальный запуск

# Бэкенд
cd backend
npm install
npm run migrate
npm run seed
npm start

# Фронтенд (в другом терминале)
cd frontend
npm install
npm run dev


👥 Тестовые пользователи

Роль                   Имя                   Пароль
Диспетчер           dispatcher               123456
Мастер 1            master1                  123456
Мастер 2            master2                  123456


🧪 Проверка защиты от гонок

# Терминал 1
curl -X POST http://localhost:3001/api/requests/1/take \
  -H "Content-Type: application/json" \
  -H "Authorization: master1"

# Терминал 2 (запустить почти одновременно)
curl -X POST http://localhost:3001/api/requests/1/take \
  -H "Content-Type: application/json" \
  -H "Authorization: master2"

# Ожидаемый результат: один 200 OK, второй 409 Conflict


📁 Структура проекта

repair-service/
├── backend/          # Node.js + Express
├── frontend/         # React + SCSS
├── docker-compose.yml
├── README.md
├── DECISIONS.md
└── PROMPTS.md


📸 Скриншоты