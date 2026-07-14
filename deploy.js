#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Начинаем деплой...');

// Проверяем наличие .next папки и удаляем её
if (fs.existsSync('.next')) {
  console.log('🧹 Очищаем кэш сборки...');
  fs.rmSync('.next', { recursive: true, force: true });
}

// Собираем проект
console.log('🔨 Собираем проект...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Ошибка сборки:', error);
    return;
  }
  
  console.log('✅ Сборка завершена!');
  console.log(stdout);
  
  if (stderr) {
    console.log('⚠️ Предупреждения:', stderr);
  }
  
  // Деплоим на Vercel
  console.log('🌐 Деплоим на Vercel...');
  exec('vercel --prod', (error, stdout, stderr) => {
    if (error) {
      console.log('ℹ️ Для деплоя выполните: vercel --prod');
      return;
    }
    
    console.log('🎉 Деплой завершен!');
    console.log(stdout);
  });
});