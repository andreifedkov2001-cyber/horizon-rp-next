import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Проверяем переменные окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ 
        error: 'Supabase переменные окружения не настроены',
        missing: {
          url: !supabaseUrl,
          anonKey: !supabaseAnonKey
        }
      })
    }

    // Проверяем подключение к базе данных
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name')
      .limit(3)

    if (rolesError) {
      return res.status(500).json({ 
        error: 'Ошибка подключения к базе данных',
        details: rolesError.message,
        hint: 'Убедитесь, что SQL схема выполнена в Supabase'
      })
    }

    // Проверяем таблицы
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1)

    const { data: logs, error: logsError } = await supabase
      .from('logs')
      .select('count(*)')
      .limit(1)

    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('count(*)')
      .limit(1)

    return res.status(200).json({
      status: 'success',
      message: 'Подключение к Supabase работает!',
      environment: {
        supabaseUrl: supabaseUrl.replace(/\/.*/, '/***'), // скрываем детали URL
        hasAnonKey: !!supabaseAnonKey,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasJwtSecret: !!process.env.JWT_SECRET
      },
      database: {
        roles: roles?.length || 0,
        users: usersError ? 'error' : 'ok',
        logs: logsError ? 'error' : 'ok',
        news: newsError ? 'error' : 'ok'
      },
      tables: {
        rolesData: roles,
        errors: {
          users: usersError?.message,
          logs: logsError?.message,
          news: newsError?.message
        }
      }
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return res.status(500).json({ 
      error: 'Критическая ошибка подключения',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    })
  }
}