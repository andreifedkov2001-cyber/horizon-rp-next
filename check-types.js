const { spawn } = require('child_process');

console.log('🔍 Проверяем типы TypeScript...');

const tsc = spawn('npx', ['tsc', '--noEmit'], {
  stdio: 'inherit',
  shell: true
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Проверка типов завершена успешно!');
  } else {
    console.log('❌ Есть ошибки TypeScript!');
  }
});

tsc.on('error', (error) => {
  console.log('❌ Ошибка запуска проверки:', error.message);
});