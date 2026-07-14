import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import jwt from 'jsonwebtoken'

// Middleware для проверки админ прав
async function verifyAdmin(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single()

    if (user && (user.role === 'Admin' || user.role === 'Moder')) {
      return user
    }
  } catch (error) {
    console.error('Token verification error:', error)
  }
  return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await verifyAdmin(req)
  if (!admin) {
    return res.status(403).json({ error: 'Доступ запрещен' })
  }

  try {
    if (req.method === 'GET') {
      // Получить все логи
      const { data: logs, error } = await supabase
        .from('logs')
        .select('id, time, type, text, user_id')
        .order('time', { ascending: false })
        .limit(500) // ограничиваем количество логов

      if (error) throw error
      
      // Форматируем время для совместимости
      const formattedLogs = logs.map(log => ({
        ...log,
        time: new Date(log.time).toLocaleString('ru-RU')
      }))
      
      return res.status(200).json({ logs: formattedLogs })

    } else if (req.method === 'DELETE') {
      // Очистить все логи (только для админов)
      if (admin.role !== 'Admin') {
        return res.status(403).json({ error: 'Только администраторы могут очищать логи' })
      }

      const { error } = await supabase
        .from('logs')
        .delete()
        .gte('id', '00000000-0000-0000-0000-000000000000') // удаляем все

      if (error) throw error

      // Логируем очистку
      await supabase.from('logs').insert({
        type: 'admin',
        text: `${admin.nick} очистил логи`,
        user_id: admin.id
      })

      return res.status(200).json({ success: true })
    }

    res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Logs API error:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}