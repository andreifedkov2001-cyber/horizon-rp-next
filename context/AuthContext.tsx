import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string; nick: string; email: string; role: string; joined: string; banned?: boolean
}
interface AuthCtx {
  user: User | null
  login: (nick: string, pass: string) => string | null
  register: (nick: string, email: string, pass: string) => string | null
  logout: () => void
  authOpen: boolean
  authTab: 'login' | 'register'
  openAuth: (tab?: 'login' | 'register') => void
  closeAuth: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

const ls = {
  get: (k: string, fb: any = null) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? fb } catch { return fb } },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
  rm:  (k: string) => localStorage.removeItem(k),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [authOpen, setOpen]   = useState(false)
  const [authTab, setTab]     = useState<'login'|'register'>('login')

  useEffect(() => { const s = ls.get('hrp_session'); if (s) setUser(s) }, [])

  const openAuth  = (tab: 'login'|'register' = 'login') => { setTab(tab); setOpen(true) }
  const closeAuth = () => setOpen(false)

  const login = (nick: string, pass: string): string | null => {
    const users: User[] = ls.get('hrp_users', [])
    const u = users.find(u => u.nick.toLowerCase() === nick.toLowerCase())
    if (!u) return 'Пользователь не найден'
    if (ls.get('hrp_p_' + u.id) !== btoa(pass)) return 'Неверный пароль'
    if (u.banned) return 'Аккаунт заблокирован'
    ls.set('hrp_session', u); setUser(u); closeAuth(); return null
  }

  const register = (nick: string, email: string, pass: string): string | null => {
    if (!nick || nick.length < 3) return 'Никнейм минимум 3 символа'
    if (!email || !email.includes('@')) return 'Неверный email'
    if (!pass || pass.length < 6) return 'Пароль минимум 6 символов'
    const users: User[] = ls.get('hrp_users', [])
    if (users.find(u => u.nick.toLowerCase() === nick.toLowerCase())) return 'Никнейм занят'
    if (users.find(u => u.email === email.toLowerCase())) return 'Email уже используется'
    const u: User = { id: 'u'+Date.now(), nick, email: email.toLowerCase(), role: 'Player', joined: new Date().toLocaleDateString('ru-RU') }
    ls.set('hrp_users', [...users, u])
    ls.set('hrp_p_' + u.id, btoa(pass))
    ls.set('hrp_session', u); setUser(u); closeAuth(); return null
  }

  const logout = () => { ls.rm('hrp_session'); setUser(null) }

  return <Ctx.Provider value={{ user, login, register, logout, authOpen, authTab, openAuth, closeAuth }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
