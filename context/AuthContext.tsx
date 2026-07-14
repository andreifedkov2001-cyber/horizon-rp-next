import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string; nick: string; email: string; role: string; joined: string; banned?: boolean
}
interface AuthCtx {
  user: User | null
  login: (nick: string, pass: string) => Promise<string | null>
  register: (nick: string, email: string, pass: string) => Promise<string | null>
  logout: () => void
  authOpen: boolean
  authTab: 'login' | 'register'
  openAuth: (tab?: 'login' | 'register') => void
  closeAuth: () => void
  loading: boolean
}

const Ctx = createContext<AuthCtx | null>(null)

const ls = {
  get: (k: string, fb: any = null) => { 
    if (typeof window === 'undefined') return fb
    try { return JSON.parse(localStorage.getItem(k) || 'null') ?? fb } catch { return fb } 
  },
  set: (k: string, v: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(k, JSON.stringify(v))
  },
  rm:  (k: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(k)
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [authOpen, setOpen]   = useState(false)
  const [authTab, setTab]     = useState<'login'|'register'>('login')
  const [loading, setLoading] = useState(false)

  // Проверяем токен при загрузке
  useEffect(() => { 
    const token = ls.get('hrp_token')
    const savedUser = ls.get('hrp_session')
    if (token && savedUser) {
      setUser(savedUser)
      // Можно добавить проверку валидности токена
    }
  }, [])

  const openAuth  = (tab: 'login'|'register' = 'login') => { setTab(tab); setOpen(true) }
  const closeAuth = () => setOpen(false)

  const login = async (nick: string, pass: string): Promise<string | null> => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, password: pass })
      })

      const data = await response.json()

      if (!response.ok) {
        return data.error || 'Ошибка входа'
      }

      // Сохраняем токен и пользователя
      ls.set('hrp_token', data.token)
      ls.set('hrp_session', data.user)
      setUser(data.user)
      closeAuth()
      return null

    } catch (error) {
      console.error('Login error:', error)
      return 'Ошибка подключения к серверу'
    } finally {
      setLoading(false)
    }
  }

  const register = async (nick: string, email: string, pass: string): Promise<string | null> => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, email, password: pass })
      })

      const data = await response.json()

      if (!response.ok) {
        return data.error || 'Ошибка регистрации'
      }

      // После успешной регистрации логиним пользователя
      return await login(nick, pass)

    } catch (error) {
      console.error('Register error:', error)
      return 'Ошибка подключения к серверу'
    } finally {
      setLoading(false)
    }
  }

  const logout = () => { 
    ls.rm('hrp_token')
    ls.rm('hrp_session')
    setUser(null) 
  }

  return <Ctx.Provider value={{ 
    user, 
    login, 
    register, 
    logout, 
    authOpen, 
    authTab, 
    openAuth, 
    closeAuth,
    loading 
  }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
