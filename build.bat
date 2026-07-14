@echo off
echo 🚀 Начинаем сборку...

if exist .next (
    echo 🧹 Очищаем кэш...
    rmdir /s /q .next
)

echo 🔨 Собираем проект...
call npm run build

if %errorlevel% eql 0 (
    echo ✅ Сборка завершена успешно!
    echo 🌐 Готов к деплою на Vercel!
    echo Выполните: vercel --prod
) else (
    echo ❌ Ошибка сборки!
)

pause