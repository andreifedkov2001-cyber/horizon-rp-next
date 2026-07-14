import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для базы данных
export interface User {
  id: string
  nick: string
  email: string
  password_hash: string
  role: string
  joined: string
  banned: boolean
  created_at?: string
  updated_at?: string
}

export interface Log {
  id: string
  time: string
  type: 'auth' | 'forum' | 'admin'
  text: string
  user_id?: string
  created_at?: string
}

export interface Role {
  id: string
  name: string
  color: string
  icon: string
  priority: number
  created_at?: string
}

export interface News {
  id: string
  tag: string
  tag_color: string
  date: string
  title: string
  description: string
  author_id: string
  created_at?: string
  updated_at?: string
}