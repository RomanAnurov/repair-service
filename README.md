# 🛠️ Веб-сервис "Заявки в ремонтную службу"

## 📋 Описание
Веб-приложение для приёма и обработки заявок в ремонтную службу.

## 🚀 Быстрый старт

### Вариант A: Docker Compose (рекомендуется)

```bash
# Одна команда — и всё работает!
docker compose up --build


Приложение доступно:
Фронтенд: http://localhost:3000
Бэкенд: http://localhost:3001



👥 Тестовые пользователи

Роль                   Имя                   Пароль
Диспетчер           dispatcher               123456
Мастер 1            master1                  123456
Мастер 2            master2                  123456


🧪 Проверка защиты от гонок

🔹 Способ 1: Автотест (рекомендуется)
# Запустить тесты
docker-compose exec backend npm test

🔹 Способ 2: Скрипт test-race.sh (автоматически)
# Запустить скрипт
./test-race.sh

Что делает скрипт:
✅ Проверяет, что бэкенд доступен
✅ Находит последнюю заявку в списке
✅ Назначает её мастеру (статус → assigned)
✅ Запускает два запроса take одновременно
✅ Проверяет, что один получил 200, второй 409


📁 Структура проекта

repair-service/
├── backend/          # Node.js + Express
├── frontend/         # React + SCSS
├── docker-compose.yml
├── README.md
├── DECISIONS.md
└── PROMPTS.md


 Быстрые команды для повседневной работы

 # Одна команда — и всё работает!
docker compose up --build

 # 🔁 Перезапустить всё (без пересборки)
docker compose restart

# 🔁 Пересобрать и перезапустить
docker compose up --build -d

# 🛑 Остановить (сохранить данные БД)
docker compose down

# 🗑️ Полностью сбросить (удалить данные БД)
docker compose down -v

# 📋 Посмотреть логи
docker compose logs -f backend
docker compose logs -f frontend

# 🧪 Запустить тесты
docker-compose exec backend npm test

# 🐚 Войти в контейнер бэкенда
docker-compose exec backend sh

# 🐚 Войти в контейнер БД
docker-compose exec db mysql -u repair_user -prepair_pass repair_service