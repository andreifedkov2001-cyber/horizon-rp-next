import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'

interface LocalUser {
  id: string
  nick: string
  email: string
  role: string
  joined: string
  banned?: boolean
}

export default function MigratePage() {
  const [localUsers, setLocalUsers] = useState<LocalUser[]>([])
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [migrationLog, setMigrationLog] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Загружаем пользователей из localStorage
    try {
      const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
      setLocalUsers(users)
      addLog(`Найдено ${users.length} пользователей в localStorage`)
    } catch (err) {
      addLog('Ошибка загрузки данных из localStorage')
    }
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMigrationLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const migrateUsers = async () => {
    if (localUsers.length === 0) {
      setError('Нет пользователей для миграции')
      return
    }

    setMigrationStatus('running')
    setError('')
    addLog('Начинаем миграцию пользователей...')

    let successCount = 0
    let errorCount = 0

    for (const user of localUsers) {
      try {
        // Получаем пароль из localStorage
        const passwordHash = localStorage.getItem(`hrp_p_${user.id}`)
        if (!passwordHash) {
          addLog(`⚠️ Пароль для ${user.nick} не найден, пропускаем`)
          errorCount++
          continue
        }

        // Декодируем base64 пароль и регистрируем пользователя
        const password = atob(passwordHash)
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nick: user.nick,
            email: user.email,
            password: password
          })
        })

        if (response.ok) {
          addLog(`✅ Успешно мигрировал: ${user.nick}`)
          successCount++

          // Если пользователь не Player, обновляем роль
          if (user.role !== 'Player') {
            // TODO: Обновить роль через админ API
            addLog(`ℹ️ ${user.nick} имеет роль ${user.role}, обновите вручную в админ-панели`)
          }
        } else {
          const data = await response.json()
          addLog(`❌ Ошибка миграции ${user.nick}: ${data.error}`)
          errorCount++
        }
      } catch (err) {
        addLog(`❌ Ошибка миграции ${user.nick}: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`)
        errorCount++
      }

      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    addLog(`\n=== МИГРАЦИЯ ЗАВЕРШЕНА ===`)
    addLog(`Успешно: ${successCount}`)
    addLog(`Ошибок: ${errorCount}`)
    addLog(`Всего: ${localUsers.length}`)

    setMigrationStatus(errorCount === 0 ? 'success' : 'error')
  }

  const clearLocalStorage = () => {
    if (confirm('Вы уверены, что хотите очистить все данные localStorage? Это действие нельзя отменить!')) {
      const keys = [
        'hrp_users', 'hrp_session', 'hrp_logs', 'hrp_topics', 
        'hrp_settings', 'hrp_roles', 'hrp_news'
      ]
      
      keys.forEach(key => localStorage.removeItem(key))
      
      // Также удаляем пароли
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('hrp_p_')) {
          localStorage.removeItem(key)
        }
      })
      
      addLog('🗑️ localStorage очищен')
      setLocalUsers([])
    }
  }

  return (
    <>
      <Head>
        <title>Миграция данных — Horizon RP</title>
      </Head>
      
      <div className="min-h-screen" style={{ background: '#0a0a0f', color: '#fff' }}>
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-manrope font-black text-4xl mb-2">
              Миграция данных
            </h1>
            <p className="text-lg mb-8" style={{ color: '#A9B0C2' }}>
              Перенос пользователей из localStorage в Supabase базу данных
            </p>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="font-manrope font-black text-2xl text-blue-400">{localUsers.length}</div>
                <div className="text-sm" style={{ color: '#A9B0C2' }}>Пользователей найдено</div>
              </div>
              
              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">
                  {migrationStatus === 'idle' ? '⏳' : 
                   migrationStatus === 'running' ? '🔄' : 
                   migrationStatus === 'success' ? '✅' : '❌'}
                </div>
                <div className="font-manrope font-black text-2xl text-purple-400">
                  {migrationStatus === 'idle' ? 'Готов' : 
                   migrationStatus === 'running' ? 'Выполняется' : 
                   migrationStatus === 'success' ? 'Завершено' : 'Ошибка'}
                </div>
                <div className="text-sm" style={{ color: '#A9B0C2' }}>Статус миграции</div>
              </div>

              <div className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="font-manrope font-black text-2xl text-green-400">{migrationLog.length}</div>
                <div className="text-sm" style={{ color: '#A9B0C2' }}>Записей в логе</div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl" 
                   style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* Список пользователей */}
            {localUsers.length > 0 && (
              <div className="glass-card mb-8">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="font-semibold text-lg">Пользователи для миграции</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {localUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between px-6 py-3 border-b border-white/5">
                      <div>
                        <div className="font-medium">{user.nick}</div>
                        <div className="text-sm" style={{ color: '#A9B0C2' }}>
                          {user.email} • {user.role} • {user.joined}
                        </div>
                      </div>
                      {user.banned && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                          Забанен
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки управления */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={migrateUsers}
                disabled={migrationStatus === 'running' || localUsers.length === 0}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {migrationStatus === 'running' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Миграция...
                  </>
                ) : (
                  '🚀 Начать миграцию'
                )}
              </button>

              <button 
                onClick={clearLocalStorage}
                className="px-8 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                🗑️ Очистить localStorage
              </button>
            </div>

            {/* Лог миграции */}
            {migrationLog.length > 0 && (
              <div className="glass-card">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Лог миграции</h3>
                  <button 
                    onClick={() => setMigrationLog([])}
                    className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Очистить
                  </button>
                </div>
                <div className="p-6">
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                    {migrationLog.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Инструкция */}
            <div className="mt-8 glass-card p-6">
              <h3 className="font-semibold text-lg mb-4">📋 Инструкция</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: '#A9B0C2' }}>
                <li>Убедитесь, что Supabase настроен и база данных создана</li>
                <li>Проверьте переменные окружения в .env.local</li>
                <li>Нажмите "Начать миграцию" для переноса пользователей</li>
                <li>После успешной миграции обновите роли администраторов вручную</li>
                <li>Протестируйте вход с новыми учетными данными</li>
                <li>Только после успешного теста очистите localStorage</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          items-center;
          justify-content: center;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  )
}