import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Главная', href: '/' },
  { label: 'Новости', href: '/news' },
  { label: 'Донат', href: '/donate' },
  { label: 'Форум', href: '/forum' },
  { label: 'Как зайти', href: '/start' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu]         = useState(false)
  const [drop, setDrop]         = useState(false)
  const [avatar, setAvatar]     = useState<string|null>(null)
  const { user, logout, openAuth } = useAuth()

  // Загружаем аватар из localStorage
  useEffect(() => {
    if (!user) { setAvatar(null); return }
    const load = () => {
      try {
        const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
        const u = users.find((x: any) => x.id === user.id)
        setAvatar(u?.avatar || null)
      } catch { setAvatar(null) }
    }
    load()
    window.addEventListener('avatarUpdate', load)
    return () => window.removeEventListener('avatarUpdate', load)
  }, [user])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    if (!drop) return
    const h = () => setDrop(false)
    window.addEventListener('click', h)
    return () => window.removeEventListener('click', h)
  }, [drop])

  const roleMap: Record<string,string> = { Admin:'👑 Администратор', Moder:'🛡 Модератор', Player:'🎮 Игрок' }

  return (
    <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? { background: 'rgba(9,11,16,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(109,93,251,0.1)' } : {}}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>H</div>
          <span className="font-manrope font-black text-xl">HORIZON<span className="gradient-text">RP</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {NAV.map(l => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#A9B0C2' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff', e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A9B0C2', e.currentTarget.style.background = 'transparent')}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {user ? (
            <div className="relative" onClick={e => { e.stopPropagation(); setDrop(v => !v) }}>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                  style={{ background: avatar ? 'transparent' : 'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>
                  {avatar
                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    : user.nick[0].toUpperCase()
                  }
                </div>
                <span className="text-sm font-medium">{user.nick}</span>
                <svg className={`w-4 h-4 transition-transform ${drop ? 'rotate-180' : ''}`} style={{ color: '#A9B0C2' }}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <AnimatePresence>
                {drop && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                    onClick={e => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ background: 'rgba(18,21,29,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="font-semibold text-sm">{user.nick}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#A9B0C2' }}>{roleMap[user.role] || '🎮 Игрок'}</div>
                    </div>
                    <div className="p-1">
                      {[
                        { label: '👤 Мой профиль', href: '/profile' },
                        { label: '💎 Донат', href: '/donate' },
                        ...(user.role === 'Admin' || user.role === 'Moder' ? [{ label: '⚙️ Админ панель', href: '/admin' }] : []),
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDrop(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                          style={{ color: '#A9B0C2' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)', e.currentTarget.style.color = '#fff')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#A9B0C2')}>
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={() => { logout(); setDrop(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-red-400"
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        🚪 Выйти
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button onClick={() => openAuth('login')} className="text-sm font-medium px-4 py-2 transition-colors" style={{ color: '#A9B0C2' }}>Войти</button>
              <button onClick={() => openAuth('register')} className="btn-primary text-sm py-2 px-5">Личный кабинет</button>
            </>
          )}
        </div>

        {/* Burger */}
        <button className="md:hidden ml-auto p-2" onClick={() => setMenu(v => !v)}>
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menu ? 'rotate-45 translate-y-1.5' : ''}`}/>
          <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menu ? 'opacity-0' : ''}`}/>
          <div className={`w-5 h-0.5 bg-white transition-all ${menu ? '-rotate-45 -translate-y-1.5' : ''}`}/>
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden" style={{ background: 'rgba(9,11,16,0.97)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenu(false)}
                  className="py-2 text-sm font-medium" style={{ color: '#A9B0C2' }}>{l.label}</Link>
              ))}
              <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setMenu(false)} className="btn-secondary text-sm py-2.5 justify-center">👤 Профиль</Link>
                    <button onClick={() => { logout(); setMenu(false) }} className="btn-secondary text-sm py-2.5 justify-center text-red-400">🚪 Выйти</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { openAuth('login'); setMenu(false) }} className="btn-secondary text-sm py-2.5 justify-center">Войти</button>
                    <button onClick={() => { openAuth('register'); setMenu(false) }} className="btn-primary text-sm py-2.5 justify-center">Регистрация</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
