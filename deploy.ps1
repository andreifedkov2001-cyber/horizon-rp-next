#!/usr/bin/env powershell

Write-Host "🚀 Начинаем деплой..." -ForegroundColor Green

# Очищаем кэш
if (Test-Path ".next") {
    Write-Host "🧹 Очищаем кэш сборки..." -ForegroundColor Yellow
    Remove-Item ".next" -Recurse -Force
}

# Собираем проект
Write-Host "🔨 Собираем проект..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Сборка завершена успешно!" -ForegroundColor Green
    
    # Деплоим на Vercel
    Write-Host "🌐 Готов к деплою!" -ForegroundColor Magenta
    Write-Host "Выполните: vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host "❌ Ошибка сборки!" -ForegroundColor Red
}