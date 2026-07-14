import { useState } from 'react'
import Head from 'next/head'

export default function TestAPI() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult('')
    
    try {
      // Тест подключения к Supabase
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Подключение к Supabase работает\n${JSON.stringify(data, null, 2)}`)
      } else {
        setTestResult(`❌ Ошибка подключения: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setLoading(false)
    }
  }

  const testRegistration = async () => {
    setLoading(true)
    setTestResult('')
    
    try {
      const testUser = {
        nick: `TestUser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: '123456'
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Регистрация работает\nПользователь создан: ${data.user.nick}\nEmail: ${data.user.email}\nРоль: ${data.user.role}`)
      } else {
        setTestResult(`❌ Ошибка регистрации: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Тестирование API — Horizon RP</title>
      </Head>
      
      <div className="min-h-screen" style={{ background: '#0a0a0f', color: '#fff', padding: '2rem' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">🔬 Тестирование API</h1>
          
          <div className="grid gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">📋 Чек-лист настройки</h2>
              <div className="space-y-2 text-sm">
                <div>1. ✅ Supabase зависимости установлены</div>
                <div>2. ⚠️ Настройте .env.local с реальными данными Supabase</div>
                <div>3. ⚠️ Выполните SQL схему в Supabase Dashboard</div>
                <div>4. 🧪 Протестируйте подключение ниже</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">🧪 Тесты</h2>
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={testConnection}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                >
                  {loading ? '⏳ Тестируем...' : '🔗 Тест подключения'}
                </button>
                
                <button 
                  onClick={testRegistration}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                >
                  {loading ? '⏳ Тестируем...' : '👤 Тест регистрации'}
                </button>
              </div>

              {testResult && (
                <div className="bg-black/50 border border-white/20 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                  {testResult}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">📖 Инструкции</h2>
              <div className="space-y-3 text-sm" style={{ color: '#A9B0C2' }}>
                <p>
                  <strong>Перед тестированием:</strong><br/>
                  1. Создайте проект в <a href="https://supabase.com" target="_blank" className="text-blue-400 underline">Supabase</a><br/>
                  2. Скопируйте URL и API ключи в <code>.env.local</code><br/>
                  3. Выполните SQL из <code>sql/schema.sql</code> в Supabase SQL Editor<br/>
                </p>
                <p>
                  <strong>После успешного тестирования:</strong><br/>
                  1. Зарегистрируйтесь на главной странице<br/>
                  2. В Supabase Table Editor измените свою роль на "Admin"<br/>
                  3. Войдите в админ-панель <code>/admin</code><br/>
                </p>
                <p>
                  <strong>Миграция данных:</strong><br/>
                  Если у вас есть данные в localStorage, используйте страницу <code>/migrate</code>
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4">🔧 Переменные окружения</h2>
              <div className="bg-black/50 border border-white/20 rounded-lg p-4 font-mono text-sm">
                <div style={{ color: '#A9B0C2' }}># Скопируйте это в ваш .env.local:</div>
                <div style={{ color: '#60a5fa' }}>NEXT_PUBLIC_SUPABASE_URL</div>=https://your-project.supabase.co<br/>
                <div style={{ color: '#60a5fa' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>=your_anon_key<br/>
                <div style={{ color: '#60a5fa' }}>SUPABASE_SERVICE_ROLE_KEY</div>=your_service_role_key<br/>
                <div style={{ color: '#60a5fa' }}>JWT_SECRET</div>=your-random-secret-key<br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}