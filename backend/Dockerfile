# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json сначала (для кэширования слоёв)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Открываем порт
EXPOSE 3001

# Команда запуска (переопределяется в docker-compose.yml)
CMD ["npm", "run", "dev"]