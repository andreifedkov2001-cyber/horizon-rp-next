# Horizon RP - Next.js

Roleplay сервер с системой управления пользователями на базе Supabase.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка Supabase

1. Создайте проект на [Supabase](https://supabase.com)
2. Скопируйте переменные в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your-random-secret-key
```

3. Выполните SQL схему из `sql/schema.sql` в Supabase SQL Editor

### 3. Запуск проекта
```bash
npm run dev
```

## 🔧 Настройка и тестирование

### Тест подключения
Откройте `/test-api` для проверки настройки Supabase

### Первый администратор
1. Зарегистрируйтесь на главной странице
2. В Supabase Table Editor найдите свою запись в таблице `users`
3. Измените поле `role` с `Player` на `Admin`
4. Обновите страницу и зайдите в `/admin`

### Миграция из localStorage
Если у вас есть данные в localStorage, используйте `/migrate`

## 📁 Структура проекта

```
├── pages/
│   ├── api/auth/          # API аутентификации
│   ├── api/admin/         # API админ-панели
│   ├── admin.tsx          # Админ-панель
│   ├── migrate.tsx        # Миграция данных
│   └── test-api.tsx       # Тестирование
├── context/
│   └── AuthContext.tsx    # Контекст аутентификации
├── hooks/
│   └── useAdminApi.ts     # Хуки для админ API
├── lib/
│   └── supabase.ts        # Клиент Supabase
├── sql/
│   └── schema.sql         # Схема базы данных
└── components/            # React компоненты
```

## 🛠 Возможности

- ✅ Регистрация и аутентификация пользователей
- ✅ Админ-панель с управлением пользователями
- ✅ Система ролей (Admin, Moder, Player)
- ✅ Логирование действий
- ✅ Управление новостями
- ✅ Row Level Security в Supabase
- ✅ Миграция данных из localStorage
- ✅ Responsive дизайн

## 📊 База данных

### Таблицы
- `users` - Пользователи
- `roles` - Роли пользователей
- `logs` - Логи действий
- `news` - Новости

### API Endpoints
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/admin/users` - Список пользователей
- `PATCH /api/admin/users` - Обновление пользователя
- `GET /api/admin/logs` - Логи системы

## 🔒 Безопасность

- Пароли хешируются с bcrypt
- JWT токены для аутентификации  
- Row Level Security в Supabase
- Проверка ролей на уровне API

## 📝 Development

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Продакшн
npm start
```

## 🐛 Отладка

1. Проверьте переменные окружения в `.env.local`
2. Убедитесь, что SQL схема выполнена в Supabase
3. Используйте `/test-api` для диагностики
4. Проверьте логи в браузере и Supabase Dashboard

---

Создано для Horizon RP сервера 🎮