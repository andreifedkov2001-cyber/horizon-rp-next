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
      // Получить всех пользователей
      const { data: users, error } = await supabase
        .from('users')
        .select('id, nick, email, role, joined, banned, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json({ users })

    } else if (req.method === 'PATCH') {
      // Обновить пользователя
      const { userId, role, banned } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'User ID обязателен' })
      }

      const updates: any = {}
      if (role !== undefined) updates.role = role
      if (banned !== undefined) updates.banned = banned

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('id, nick, email, role, joined, banned')
        .single()

      if (error) throw error

      // Логируем изменение
      await supabase.from('logs').insert({
        type: 'admin',
        text: `${admin.nick} изменил ${updatedUser.nick}: роль=${role}${banned ? ' [БАН]' : ''}`,
        user_id: admin.id
      })

      return res.status(200).json({ user: updatedUser })

    } else if (req.method === 'DELETE') {
      // Удалить пользователя (только для админов)
      if (admin.role !== 'Admin') {
        return res.status(403).json({ error: 'Только администраторы могут удалять пользователей' })
      }

      const { userId } = req.body
      if (!userId) {
        return res.status(400).json({ error: 'User ID обязателен' })
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      await supabase.from('logs').insert({
        type: 'admin',
        text: `${admin.nick} удалил пользователя`,
        user_id: admin.id
      })

      return res.status(200).json({ success: true })
    }

    res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Users API error:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}