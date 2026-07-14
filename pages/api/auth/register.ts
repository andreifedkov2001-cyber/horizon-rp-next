import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nick, email, password } = req.body

  // Валидация
  if (!nick || nick.length < 3) {
    return res.status(400).json({ error: 'Никнейм минимум 3 символа' })
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Неверный email' })
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Пароль минимум 6 символов' })
  }

  try {
    // Проверяем существование пользователя
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`nick.ilike.${nick},email.ilike.${email.toLowerCase()}`)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким никнеймом или email уже существует' })
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 12)

    // Создаем пользователя
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        nick,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: 'Player'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Ошибка создания аккаунта' })
    }

    // Логируем регистрацию
    await supabase.from('logs').insert({
      type: 'auth',
      text: `Новый пользователь зарегистрировался: ${nick}`,
      user_id: newUser.id
    })

    // Возвращаем пользователя без пароля
    const { password_hash, ...userWithoutPassword } = newUser
    res.status(201).json({ user: userWithoutPassword })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}