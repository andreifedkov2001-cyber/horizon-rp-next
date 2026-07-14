import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nick, password } = req.body

  if (!nick || !password) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }

  try {
    // Ищем пользователя
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .ilike('nick', nick)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Пользователь не найден' })
    }

    // Проверяем бан
    if (user.banned) {
      return res.status(403).json({ error: 'Аккаунт заблокирован' })
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный пароль' })
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Логируем вход
    await supabase.from('logs').insert({
      type: 'auth',
      text: `${user.nick} вошел в систему`,
      user_id: user.id
    })

    // Возвращаем пользователя без пароля и токен
    const { password_hash, ...userWithoutPassword } = user
    res.status(200).json({ 
      user: userWithoutPassword, 
      token 
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}