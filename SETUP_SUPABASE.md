# Настройка Supabase для Horizon RP

## Шаг 1: Создание проекта Supabase

1. Перейдите на https://supabase.com и создайте аккаунт
2. Создайте новый проект
3. Скопируйте URL проекта и анонимный ключ (anon key)
4. Также скопируйте service role key из настроек API

## Шаг 2: Настройка переменных окружения

Обновите файл `.env.local`:

```env
# Замените на ваши реальные данные из Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret-key-for-auth-tokens
```

## Шаг 3: Создание таблиц в базе данных

1. Откройте Supabase Dashboard
2. Перейдите в раздел SQL Editor
3. Скопируйте содержимое файла `sql/schema.sql` и выполните его

## Шаг 4: Настройка Row Level Security (RLS)

RLS уже настроен в схеме, но убедитесь что:
- Таблицы имеют включенный RLS
- Политики настроены правильно
- Публичный доступ есть только к ролям и новостям

## Шаг 5: Создание первого администратора

После запуска приложения:
1. Зарегистрируйтесь как обычный пользователь
2. В Supabase Dashboard откройте Table Editor
3. Найдите свою запись в таблице `users`
4. Измените поле `role` с `Player` на `Admin`
5. Обновите страницу админ-панели

## Шаг 6: Миграция данных из localStorage (опционально)

Если у вас уже есть данные в localStorage, используйте встроенный инструмент миграции:
1. Откройте `/migrate` в браузере
2. Следуйте инструкциям для переноса данных

## Структура базы данных

### users
- `id` (UUID) - первичный ключ
- `nick` (VARCHAR) - никнейм пользователя
- `email` (VARCHAR) - email адрес
- `password_hash` (TEXT) - хешированный пароль
- `role` (VARCHAR) - роль пользователя
- `joined` (DATE) - дата регистрации
- `banned` (BOOLEAN) - статус бана

### roles
- `id` (VARCHAR) - идентификатор роли
- `name` (VARCHAR) - название роли
- `color` (VARCHAR) - цвет роли в HEX
- `icon` (VARCHAR) - эмодзи иконка
- `priority` (INTEGER) - приоритет роли

### logs
- `id` (UUID) - первичный ключ
- `time` (TIMESTAMP) - время события
- `type` (VARCHAR) - тип лога (auth, forum, admin)
- `text` (TEXT) - текст лога
- `user_id` (UUID) - ссылка на пользователя

### news
- `id` (UUID) - первичный ключ
- `tag` (VARCHAR) - тег новости
- `tag_color` (VARCHAR) - цвет тега
- `date` (VARCHAR) - дата публикации
- `title` (VARCHAR) - заголовок
- `description` (TEXT) - описание
- `author_id` (UUID) - автор новости

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход в систему

### Админ панель
- `GET /api/admin/users` - список пользователей
- `PATCH /api/admin/users` - обновление пользователя
- `DELETE /api/admin/users` - удаление пользователя
- `GET /api/admin/logs` - список логов
- `DELETE /api/admin/logs` - очистка логов

## Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены используются для аутентификации
- Row Level Security защищает данные
- Только администраторы могут управлять пользователями