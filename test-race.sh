#!/bin/bash
# test-race.sh — Исправленная версия для Windows Git Bash

echo "🧪 Тест защиты от гонок..."
echo ""

# Проверяем, что бэкенд доступен
if ! curl -s http://localhost:3001/api/health > /dev/null; then
  echo "❌ Бэкенд недоступен!"
  exit 1
fi

echo "✅ Бэкенд работает"
echo ""

# Получаем все заявки и ищем assigned
RESPONSE=$(curl -s http://localhost:3001/api/requests)

# Ищем заявку со статусом "assigned"
ASSIGNED_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$ASSIGNED_ID" ]; then
  echo "❌ Не удалось найти заявки!"
  echo "💡 Проверьте: curl http://localhost:3001/api/requests"
  exit 1
fi

# Назначаем эту заявку мастеру
echo "📋 Назначаем заявку ID: $ASSIGNED_ID мастеру..."
curl -s -X PUT http://localhost:3001/api/requests/$ASSIGNED_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: dispatcher" \
  -d '{"masterId": 2}' > /dev/null

echo "✅ Заявка назначена"
echo ""

# Запускаем два запроса ОДНОВРЕМЕННО
echo "⏳ Запускаем два запроса одновременно..."

curl -s -w "%{http_code}" -X POST http://localhost:3001/api/requests/$ASSIGNED_ID/take \
  -H "Content-Type: application/json" \
  -H "Authorization: master1" \
  -d '{"masterId": 2}' > /tmp/result1.txt &
PID1=$!

curl -s -w "%{http_code}" -X POST http://localhost:3001/api/requests/$ASSIGNED_ID/take \
  -H "Content-Type: application/json" \
  -H "Authorization: master2" \
  -d '{"masterId": 3}' > /tmp/result2.txt &
PID2=$!

# Ждём завершения
wait $PID1
wait $PID2

# Извлекаем HTTP коды (убираем \r для Windows)
CODE1=$(cat /tmp/result1.txt | tr -d '\r' | tail -c 3)
CODE2=$(cat /tmp/result2.txt | tr -d '\r' | tail -c 3)

echo ""
echo "📊 Результаты:"
echo "  Запрос 1 (master1): HTTP $CODE1"
echo "  Запрос 2 (master2): HTTP $CODE2"
echo ""

# 🔑 ИСПРАВЛЕННОЕ СРАВНЕНИЕ (простая логика)
if [ "$CODE1" != "$CODE2" ] && { [ "$CODE1" = "200" ] || [ "$CODE1" = "409" ]; } && { [ "$CODE2" = "200" ] || [ "$CODE2" = "409" ]; }; then
  echo "🎉 Тест пройден: защита от гонок работает!"
  echo ""
  echo "✅ Один запрос успешен (200), второй получил конфликт (409)"
else
  echo "⚠️ Тест не пройден"
  echo "  Ожидалось: один 200, другой 409"
  echo "  Получено: $CODE1 и $CODE2"
fi

# Очистка
rm -f /tmp/result1.txt /tmp/result2.txt