import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useAdminUsers, useAdminLogs } from '../hooks/useAdminApi'

interface User { id: string; nick: string; email: string; role: string; joined: string; banned?: boolean }
interface Role { id: string; name: string; color: string; icon: string }
interface News { id: string; tag: string; tagColor: string; date: string; title: string; desc: string }

const ls = {
  get: (k: string, fb: any = []) => { 
    if (typeof window === 'undefined') return fb
    try { return JSON.parse(localStorage.getItem(k)||'null')??fb } catch { return fb } 
  },
  set: (k: string, v: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(k, JSON.stringify(v))
  },
}

const ROLE_COLORS: Record<string,{ bg:string; color:string }> = {
  Admin:  { bg:'rgba(244,114,182,0.12)', color:'#f472b6' },
  Moder:  { bg:'rgba(167,139,250,0.12)', color:'#a78bfa' },
  Player: { bg:'rgba(96,165,250,0.12)',  color:'#60a5fa' },
}

const Admin: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { users, loading: usersLoading, error: usersError, updateUser } = useAdminUsers()
  const { logs, loading: logsLoading, error: logsError, clearLogs } = useAdminLogs()
  
  const [tab, setTab] = useState<'stats'|'users'|'roles'|'news'|'logs'|'settings'>('stats')
  const [uSearch, setUSearch] = useState('')
  const [lSearch, setLSearch] = useState('')
  const [lType, setLType] = useState('')
  const [userSubTab, setUserSubTab] = useState<'members'|'staff'>('members')
  const [editU, setEditU] = useState<User|null>(null)
  const [eRole, setERole] = useState('')
  const [eBan, setEBan] = useState(false)
  const [cfg, setCfg]         = useState({ forumName: 'Horizon RP Forum', perPage: 15, regOpen: true })

  // Новости
  const DEFAULT_NEWS: News[] = [
    { id: 'n1', tag: 'Обновление', tagColor: '#a78bfa', date: '5 июля 2024', title: 'Обновление 3.0 — Новые районы и профессии', desc: 'Добавлены 3 новых района, 47 автомобилей, 5 профессий и полностью переработана система полиции.' },
    { id: 'n2', tag: 'Событие',    tagColor: '#67e8f9', date: '1 июля 2024',  title: 'Летний фестиваль — призы и турниры',           desc: 'Весь июль проходит летний фестиваль с гонками, турнирами и уникальными наградами.' },
    { id: 'n3', tag: 'Патч',       tagColor: '#6ee7b7', date: '28 июня 2024', title: 'Патч 2.9.5 — Исправления и оптимизация',        desc: 'Исправлены критические баги, улучшена производительность сервера.' },
  ]
  const [news, setNews]           = useState<News[]>(DEFAULT_NEWS)
  const [showAddNews, setShowAddNews] = useState(false)
  const [editNews, setEditNews]       = useState<News|null>(null)
  const [nTag, setNTag]     = useState('')
  const [nTagColor, setNTagColor] = useState('#a78bfa')
  const [nDate, setNDate]   = useState('')
  const [nTitle, setNTitle] = useState('')
  const [nDesc, setNDesc]   = useState('')

  // Роли
  const DEFAULT_ROLES: Role[] = [
    { id: 'Admin',  name: 'Администратор', color: '#f472b6', icon: '👑' },
    { id: 'Moder',  name: 'Модератор',     color: '#a78bfa', icon: '🛡' },
    { id: 'Player', name: 'Игрок',         color: '#60a5fa', icon: '🎮' },
  ]
  const [roles, setRoles]     = useState<Role[]>(DEFAULT_ROLES)
  const [editRole, setEditRole] = useState<Role|null>(null)
  const [rName, setRName]     = useState('')
  const [rColor, setRColor]   = useState('#60a5fa')
  const [rIcon, setRIcon]     = useState('🎮')
  const [showAddRole, setShowAddRole] = useState(false)
  const [newRoleId, setNewRoleId]     = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleColor, setNewRoleColor] = useState('#60a5fa')
  const [newRoleIcon, setNewRoleIcon]   = useState('🎮')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!user || (user.role !== 'Admin' && user.role !== 'Moder')) { 
      router.push('/'); return 
    }
    // Данные загружаются через хуки useAdminUsers и useAdminLogs
    const c = ls.get('hrp_settings', null); if (c) setCfg(c)
    const r = ls.get('hrp_roles', null); if (r) setRoles(r)
    const n = ls.get('hrp_news', null); if (n) setNews(n)
  }, [user, router])

  if (!user || (user.role !== 'Admin' && user.role !== 'Moder')) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0a0f' }}>
      <div className="text-6xl">🚫</div>
      <h1 className="font-manrope font-black text-2xl">Доступ запрещён</h1>
      <p className="text-sm" style={{ color: '#A9B0C2' }}>Только для администраторов</p>
      <button onClick={() => router.push('/')} className="btn-primary px-6 py-2.5 text-sm">На главную</button>
    </div>
  )

  const openEdit = (u: User) => { setEditU(u); setERole(u.role); setEBan(!!u.banned) }
  
  const saveEdit = async () => {
    if (!editU) return
    try {
      await updateUser(editU.id, { role: eRole, banned: eBan })
      setEditU(null)
      // Успех уже обрабатывается в хуке
    } catch (error) {
      console.error('Failed to update user:', error)
      // Ошибка показывается через состояние хука
    }
  }

  const toggleBan = async (u: User) => {
    try {
      await updateUser(u.id, { banned: !u.banned })
    } catch (error) {
      console.error('Failed to toggle ban:', error)
    }
  }

  const fUsers = users.filter(u => !uSearch || u.nick.toLowerCase().includes(uSearch.toLowerCase()) || u.email.toLowerCase().includes(uSearch.toLowerCase()))
  const fLogs  = logs.filter(l => (!lSearch || l.text.toLowerCase().includes(lSearch.toLowerCase())) && (!lType || l.type === lType))

  // Функции новостей
  const saveNews = (n: News[]) => { setNews(n); ls.set('hrp_news', n) }
  const openEditNews = (n: News) => { setEditNews(n); setNTag(n.tag); setNTagColor(n.tagColor); setNDate(n.date); setNTitle(n.title); setNDesc(n.desc) }
  const saveEditNews = () => {
    if (!editNews) return
    const next = news.map(n => n.id === editNews.id ? { ...n, tag: nTag, tagColor: nTagColor, date: nDate, title: nTitle, desc: nDesc } : n)
    saveNews(next)
    setEditNews(null)
  }
  const deleteNews = (id: string) => {
    saveNews(news.filter(n => n.id !== id))
  }
  const addNews = () => {
    if (!nTitle.trim()) return
    const n: News = { id: 'n' + Date.now(), tag: nTag || 'Новость', tagColor: nTagColor, date: nDate || new Date().toLocaleDateString('ru-RU'), title: nTitle, desc: nDesc }
    saveNews([n, ...news])
    setShowAddNews(false); setNTag(''); setNTagColor('#a78bfa'); setNDate(''); setNTitle(''); setNDesc('')
  }
  const resetNewsForm = () => { setNTag(''); setNTagColor('#a78bfa'); setNDate(''); setNTitle(''); setNDesc('') }

  // Функции ролей
  const saveRoles = (r: Role[]) => { setRoles(r); ls.set('hrp_roles', r) }
  const openEditRole = (r: Role) => { setEditRole(r); setRName(r.name); setRColor(r.color); setRIcon(r.icon) }
  const saveEditRole = () => {
    if (!editRole) return
    const next = roles.map(r => r.id === editRole.id ? { ...r, name: rName, color: rColor, icon: rIcon } : r)
    saveRoles(next)
    setEditRole(null)
  }
  const moveRole = (idx: number, dir: -1 | 1) => {
    const next = [...roles]
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= next.length) return
    ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
    saveRoles(next)
  }
  const addRole = () => {
    if (!newRoleId.trim() || !newRoleName.trim()) return
    if (roles.find(r => r.id === newRoleId)) return
    const next = [...roles, { id: newRoleId, name: newRoleName, color: newRoleColor, icon: newRoleIcon }]
    saveRoles(next)
    setShowAddRole(false); setNewRoleId(''); setNewRoleName(''); setNewRoleColor('#60a5fa'); setNewRoleIcon('🎮')
  }
  const deleteRole = (id: string) => {
    if (['Admin','Moder','Player'].includes(id)) return // базовые роли нельзя удалять
    const next = roles.filter(r => r.id !== id)
    saveRoles(next)
  }
  const getRoleStyle = (roleId: string) => {
    const r = roles.find(x => x.id === roleId)
    if (!r) return ROLE_COLORS.Player
    const hex = r.color
    return { bg: hex + '22', color: hex }
  }

  const TABS = [{ id:'stats',label:'📊 Статистика'},{id:'users',label:'👥 Пользователи'},{id:'roles',label:'🏷️ Роли'},{id:'news',label:'📰 Новости'},{id:'logs',label:'📋 Логи'},{id:'settings',label:'⚙️ Настройки'}] as const

  const inputStyle = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }
  const logTypeStyle = (t: string) => {
    if (t==='admin') return { background:'rgba(244,114,182,0.12)', color:'#f472b6', border:'1px solid rgba(244,114,182,0.25)' }
    if (t==='auth')  return { background:'rgba(96,165,250,0.12)',  color:'#60a5fa', border:'1px solid rgba(96,165,250,0.25)' }
    return { background:'rgba(52,211,153,0.12)', color:'#6ee7b7', border:'1px solid rgba(52,211,153,0.25)' }
  }

  return (
    <>
      <Head><title>Админ панель — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />
        <section className="pt-24 pb-6" style={{ background:'linear-gradient(135deg,#0a0a0f 0%,#0e0a18 100%)', borderBottom:'1px solid rgba(124,58,237,0.1)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <h1 className="section-title mb-1">Админ <span className="gradient-text">панель</span></h1>
              <p className="text-sm" style={{ color:'#A9B0C2' }}>Добро пожаловать, {user.nick}</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex gap-2 flex-wrap pt-6 mb-8">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={tab===t.id ? {background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'} : {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#A9B0C2'}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* СТАТИСТИКА */}
          {tab==='stats' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              {(usersLoading || logsLoading) && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-sm" style={{ color:'#A9B0C2' }}>Загрузка данных...</p>
                </div>
              )}
              
              {usersError && (
                <div className="mb-4 p-4 rounded-xl" style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171' }}>
                  Ошибка загрузки пользователей: {usersError}
                </div>
              )}
              
              {logsError && (
                <div className="mb-4 p-4 rounded-xl" style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171' }}>
                  Ошибка загрузки логов: {logsError}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[['👥',users.length,'Пользователей'],['💬',0,'Тем'],['📝',0,'Сообщений'],
                  ['🛡',users.filter(u=>u.role==='Admin'||u.role==='Moder').length,'Модераторов'],
                  ['🚫',users.filter(u=>u.banned).length,'Забанено'],['📋',logs.length,'Логов']].map(([ic,v,l],i)=>(
                  <div key={i} className="glass-card p-5 text-center">
                    <div className="text-3xl mb-2">{ic}</div>
                    <div className="font-manrope font-black text-3xl gradient-text">{v}</div>
                    <div className="text-xs mt-1" style={{ color:'#A9B0C2' }}>{l}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 font-semibold text-sm" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>🕐 Последние действия</div>
                {logs.slice(0,8).map((l,i)=>(
                  <div key={i} className="flex items-start gap-3 px-5 py-3 text-sm" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-xs flex-shrink-0 min-w-[120px]" style={{ color:'#A9B0C2' }}>{l.time}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase flex-shrink-0" style={logTypeStyle(l.type)}>{l.type}</span>
                    <span className="text-sm" style={{ color:'#A9B0C2' }}>{l.text}</span>
                  </div>
                ))}
                {!logs.length && <div className="px-5 py-8 text-center text-sm" style={{ color:'#A9B0C2' }}>Логи пусты</div>}
              </div>
            </motion.div>
          )}

          {/* ПОЛЬЗОВАТЕЛИ */}
          {tab==='users' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              {/* Подвкладки */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                {([['members','🎮 Участники'],['staff','👑 Администрация']] as const).map(([id,label])=>(
                  <button key={id}
                    onClick={()=>setUserSubTab(id)}
                    className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={userSubTab===id
                      ? {background:'linear-gradient(135deg,#7c3aed,#5b21b6)',color:'#fff'}
                      : {color:'#A9B0C2'}}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mb-5 flex-wrap">
                <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background:'rgba(18,21,29,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color:'#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={uSearch} onChange={e=>setUSearch(e.target.value)} placeholder="Поиск по нику..."
                    className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" />
                </div>
              </div>

              {/* Участники (Player) */}
              {userSubTab==='members' && (
                <div className="glass-card overflow-hidden">
                  <div className="px-5 py-3 font-semibold text-sm flex items-center justify-between"
                    style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' }}>
                    <span>🎮 Участники</span>
                    <span className="text-xs font-normal" style={{ color:'#A9B0C2' }}>
                      {fUsers.filter(u=>u.role==='Player'||(!['Admin','Moder'].includes(u.role))).length} игроков
                    </span>
                  </div>
                  {fUsers.filter(u=>u.role==='Player'||(!['Admin','Moder'].includes(u.role))).map(u=>(
                    <div key={u.id} className="flex items-center gap-3 px-5 py-3 flex-wrap"
                      style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>
                        {u.nick[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                          {u.nick}
                          {u.banned && <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background:'rgba(248,113,113,0.12)',color:'#f87171',border:'1px solid rgba(248,113,113,0.25)' }}>
                            Забанен
                          </span>}
                        </div>
                        <div className="text-xs" style={{ color:'#A9B0C2' }}>{u.email} · {u.joined}</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-semibold"
                        style={ROLE_COLORS[u.role]||ROLE_COLORS.Player}>{u.role}</span>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={()=>openEdit(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff' }}>
                          ✏️ Изменить
                        </button>
                        <button onClick={()=>toggleBan(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={u.banned
                            ? {background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.25)',color:'#6ee7b7'}
                            : {background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',color:'#f87171'}}>
                          {u.banned ? '✅ Разбан' : '🚫 Бан'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {!fUsers.filter(u=>u.role==='Player'||(!['Admin','Moder'].includes(u.role))).length &&
                    <div className="px-5 py-10 text-center text-sm" style={{ color:'#A9B0C2' }}>Участников нет</div>}
                </div>
              )}

              {/* Администрация (Admin/Moder) */}
              {userSubTab==='staff' && (
                <div className="glass-card overflow-hidden">
                  <div className="px-5 py-3 font-semibold text-sm flex items-center justify-between"
                    style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' }}>
                    <span>👑 Администрация</span>
                    <span className="text-xs font-normal" style={{ color:'#A9B0C2' }}>
                      {fUsers.filter(u=>u.role==='Admin'||u.role==='Moder').length} человек
                    </span>
                  </div>
                  {fUsers.filter(u=>u.role==='Admin'||u.role==='Moder').map(u=>(
                    <div key={u.id} className="flex items-center gap-3 px-5 py-3 flex-wrap"
                      style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                        style={{ background: u.role==='Admin'
                          ? 'linear-gradient(135deg,#f472b6,#e879f9)'
                          : 'linear-gradient(135deg,#a78bfa,#7c3aed)' }}>
                        {u.nick[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                          {u.nick}
                          {u.banned && <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background:'rgba(248,113,113,0.12)',color:'#f87171',border:'1px solid rgba(248,113,113,0.25)' }}>
                            Забанен
                          </span>}
                        </div>
                        <div className="text-xs" style={{ color:'#A9B0C2' }}>{u.email} · {u.joined}</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-semibold"
                        style={ROLE_COLORS[u.role]||ROLE_COLORS.Player}>{u.role}</span>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={()=>openEdit(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff' }}>
                          ✏️ Изменить
                        </button>
                        <button onClick={()=>toggleBan(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={u.banned
                            ? {background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.25)',color:'#6ee7b7'}
                            : {background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',color:'#f87171'}}>
                          {u.banned ? '✅ Разбан' : '🚫 Бан'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {!fUsers.filter(u=>u.role==='Admin'||u.role==='Moder').length &&
                    <div className="px-5 py-10 text-center text-sm" style={{ color:'#A9B0C2' }}>Администраторов нет</div>}
                </div>
              )}
            </motion.div>
          )}

          {/* РОЛИ */}
          {tab==='roles' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <div className="flex gap-3 mb-5 flex-wrap">
                <button onClick={()=>setShowAddRole(true)} className="btn-primary text-sm px-5 py-2.5">+ Добавить роль</button>
              </div>
              <div className="glass-card overflow-hidden">
                {roles.map((r, idx) => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-4 flex-wrap" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    {/* Кнопки приоритета */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={()=>moveRole(idx,-1)} disabled={idx===0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all disabled:opacity-25"
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#A9B0C2' }}
                        title="Выше">↑</button>
                      <button onClick={()=>moveRole(idx,1)} disabled={idx===roles.length-1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all disabled:opacity-25"
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#A9B0C2' }}
                        title="Ниже">↓</button>
                    </div>
                    {/* Номер приоритета */}
                    <div className="w-6 text-center font-manrope font-black text-lg flex-shrink-0"
                      style={{ color: '#7c3aed', opacity: 0.4 }}>{idx + 1}</div>
                    <div className="text-2xl flex-shrink-0">{r.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{r.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: r.color + '22', color: r.color, border: `1px solid ${r.color}44` }}>
                          {r.icon} {r.name}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ background:'rgba(255,255,255,0.05)', color:'#A9B0C2' }}>
                          ID: {r.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                          style={{ background: r.color }} />
                        <span className="text-xs font-mono" style={{ color:'#A9B0C2' }}>{r.color}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={()=>openEditRole(r)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa' }}>
                        ✏️ Изменить
                      </button>
                      {!['Admin','Moder','Player'].includes(r.id) && (
                        <button onClick={()=>deleteRole(r.id)}
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171' }}>
                          🗑 Удалить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* НОВОСТИ */}
          {tab==='news' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <div className="flex gap-3 mb-5 flex-wrap items-center">
                <h2 className="font-manrope font-bold text-lg flex-1">Всего новостей: {news.length}</h2>
                <button onClick={()=>{ resetNewsForm(); setShowAddNews(true) }} className="btn-primary text-sm px-5 py-2.5">
                  + Добавить новость
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {news.length === 0 && (
                  <div className="glass-card p-10 text-center" style={{ color:'#A9B0C2' }}>Новостей пока нет</div>
                )}
                {news.map((n, i) => (
                  <div key={n.id} className="glass-card p-5 flex gap-4 items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: n.tagColor + '22', color: n.tagColor, border: `1px solid ${n.tagColor}44` }}>
                          {n.tag}
                        </span>
                        <span className="text-xs" style={{ color:'#A9B0C2' }}>{n.date}</span>
                      </div>
                      <div className="font-manrope font-bold text-base mb-1">{n.title}</div>
                      <div className="text-sm leading-relaxed" style={{ color:'#A9B0C2' }}>{n.desc}</div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={()=>openEditNews(n)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', color:'#a78bfa' }}>
                        ✏️ Изменить
                      </button>
                      <button onClick={()=>deleteNews(n.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171' }}>
                        🗑 Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ЛОГИ */}
          {tab==='logs' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <div className="flex gap-3 mb-5 flex-wrap">
                <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background:'rgba(18,21,29,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color:'#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={lSearch} onChange={e=>setLSearch(e.target.value)} placeholder="Поиск по логам..."
                    className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" />
                </div>
                <select value={lType} onChange={e=>setLType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none text-white"
                  style={{ background:'rgba(18,21,29,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <option value="">Все типы</option>
                  <option value="auth">Авторизация</option>
                  <option value="forum">Форум</option>
                  <option value="admin">Админ</option>
                </select>
                <button onClick={async () => {
                  try {
                    await clearLogs()
                  } catch (error) {
                    console.error('Failed to clear logs:', error)
                  }
                }}
                  className="px-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171' }}>
                  🗑 Очистить
                </button>
              </div>
              <div className="glass-card overflow-hidden">
                {fLogs.map((l,i)=>(
                  <div key={i} className="flex items-start gap-3 px-5 py-3 text-sm" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-xs flex-shrink-0 min-w-[130px]" style={{ color:'#A9B0C2' }}>{l.time}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase flex-shrink-0" style={logTypeStyle(l.type)}>{l.type}</span>
                    <span style={{ color:'#A9B0C2' }}>{l.text}</span>
                  </div>
                ))}
                {!fLogs.length && <div className="px-5 py-10 text-center text-sm" style={{ color:'#A9B0C2' }}>Логи пусты</div>}
              </div>
            </motion.div>
          )}

          {/* НАСТРОЙКИ */}
          {tab==='settings' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-manrope font-bold text-lg mb-5">🌐 Основные</h3>
                <div className="flex flex-col gap-4">
                  {[['Название форума','forumName','text'],['Тем на странице','perPage','number']].map(([l,k,t])=>(
                    <div key={k}>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>{l}</label>
                      <input type={t} value={(cfg as any)[k]} onChange={e=>setCfg(p=>({...p,[k]:t==='number'?+e.target.value:e.target.value}))}
                        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
                    </div>
                  ))}
                  <button onClick={()=>{ ls.set('hrp_settings',cfg) }}
                    className="btn-primary justify-center">💾 Сохранить</button>
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-manrope font-bold text-lg mb-5">⚙️ Форум</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-sm">Регистрация открыта</span>
                    <button onClick={()=>setCfg(p=>({...p,regOpen:!p.regOpen}))}
                      className="w-11 h-6 rounded-full relative transition-colors"
                      style={{ background: cfg.regOpen ? '#7c3aed' : 'rgba(255,255,255,0.1)' }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                        style={{ left: cfg.regOpen ? '22px' : '2px' }} />
                    </button>
                  </div>
                  <button onClick={()=>{ ls.set('hrp_settings',cfg) }}
                    className="btn-primary justify-center mt-2">💾 Сохранить</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Модалки новостей */}
      {(showAddNews || editNews) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="w-full max-w-lg rounded-2xl p-6"
            style={{ background:'rgba(18,21,29,0.98)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <h3 className="font-manrope font-bold text-lg mb-5">{showAddNews ? '📰 Новая новость' : '✏️ Редактировать новость'}</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Тег</label>
                  <input value={nTag} onChange={e=>setNTag(e.target.value)} placeholder="Обновление, Патч..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none text-white"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Цвет тега</label>
                  <div className="flex gap-2">
                    <input value={nTagColor} onChange={e=>setNTagColor(e.target.value)}
                      className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none font-mono text-white"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }} />
                    <input type="color" value={nTagColor} onChange={e=>setNTagColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5" style={{ background:'transparent' }} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Дата</label>
                <input value={nDate} onChange={e=>setNDate(e.target.value)} placeholder="5 июля 2024"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none text-white"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Заголовок</label>
                <input value={nTitle} onChange={e=>setNTitle(e.target.value)} placeholder="Заголовок новости..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none text-white"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Описание</label>
                <textarea value={nDesc} onChange={e=>setNDesc(e.target.value)} rows={3} placeholder="Текст новости..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none text-white resize-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{ setShowAddNews(false); setEditNews(null) }} className="btn-secondary flex-1 justify-center">Отмена</button>
                <button onClick={showAddNews ? addNews : saveEditNews} className="btn-primary flex-1 justify-center">
                  {showAddNews ? 'Опубликовать' : 'Сохранить'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Модалка редактирования */}
      {editU && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background:'rgba(18,21,29,0.98)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <h3 className="font-manrope font-bold text-lg mb-5">✏️ {editU.nick}</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Роль</label>
                <select value={eRole} onChange={e=>setERole(e.target.value)} className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background:'rgba(18,21,29,0.9)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }}>
                  <option value="Player">🎮 Игрок</option>
                  <option value="Moder">🛡 Модератор</option>
                  <option value="Admin">👑 Администратор</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Заблокирован</span>
                <button onClick={()=>setEBan(v=>!v)} className="w-11 h-6 rounded-full relative transition-colors"
                  style={{ background: eBan ? '#ef4444' : 'rgba(255,255,255,0.1)' }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: eBan ? 'translateX(20px)' : 'translateX(2px)' }} />
                </button>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={()=>setEditU(null)} className="btn-secondary flex-1 justify-center">Отмена</button>
                <button onClick={saveEdit} className="btn-primary flex-1 justify-center">Сохранить</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Модалка редактирования роли */}
      {editRole && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background:'rgba(18,21,29,0.98)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <h3 className="font-manrope font-bold text-lg mb-5">✏️ Изменить роль</h3>

            {/* Превью */}
            <div className="flex items-center justify-center mb-5 p-4 rounded-xl"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm px-4 py-2 rounded-full font-semibold"
                style={{ background: rColor + '22', color: rColor, border: `1px solid ${rColor}44` }}>
                {rIcon} {rName || 'Название роли'}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Иконка</label>
                <input value={rIcon} onChange={e=>setRIcon(e.target.value)} maxLength={4}
                  placeholder="🎮" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Название</label>
                <input value={rName} onChange={e=>setRName(e.target.value)}
                  placeholder="Название роли" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Цвет</label>
                <div className="flex gap-3 items-center">
                  <input value={rColor} onChange={e=>setRColor(e.target.value)}
                    placeholder="#f472b6" className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
                  <input type="color" value={rColor} onChange={e=>setRColor(e.target.value)}
                    className="w-12 h-10 rounded-xl cursor-pointer border-0 p-0.5"
                    style={{ background:'transparent' }} />
                </div>
                {/* Быстрые цвета */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['#f472b6','#a78bfa','#60a5fa','#34d399','#fb923c','#facc15','#f87171','#e879f9'].map(c => (
                    <button key={c} onClick={()=>setRColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background:c, borderColor: rColor===c ? '#fff' : 'transparent' }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={()=>setEditRole(null)} className="btn-secondary flex-1 justify-center">Отмена</button>
                <button onClick={saveEditRole} className="btn-primary flex-1 justify-center">Сохранить</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Модалка добавления роли */}
      {showAddRole && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background:'rgba(18,21,29,0.98)', border:'1px solid rgba(124,58,237,0.2)' }}>
            <h3 className="font-manrope font-bold text-lg mb-5">+ Добавить роль</h3>

            {/* Превью */}
            <div className="flex items-center justify-center mb-5 p-4 rounded-xl"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm px-4 py-2 rounded-full font-semibold"
                style={{ background: newRoleColor + '22', color: newRoleColor, border: `1px solid ${newRoleColor}44` }}>
                {newRoleIcon} {newRoleName || 'Новая роль'}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>ID роли (латиница, без пробелов)</label>
                <input value={newRoleId} onChange={e=>setNewRoleId(e.target.value.replace(/\s/g,''))}
                  placeholder="VIP, Donator, Helper..." className="w-full rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Иконка</label>
                <input value={newRoleIcon} onChange={e=>setNewRoleIcon(e.target.value)} maxLength={4}
                  placeholder="🎮" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Название</label>
                <input value={newRoleName} onChange={e=>setNewRoleName(e.target.value)}
                  placeholder="Название роли" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color:'#A9B0C2' }}>Цвет</label>
                <div className="flex gap-3 items-center">
                  <input value={newRoleColor} onChange={e=>setNewRoleColor(e.target.value)}
                    placeholder="#60a5fa" className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none font-mono"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }} />
                  <input type="color" value={newRoleColor} onChange={e=>setNewRoleColor(e.target.value)}
                    className="w-12 h-10 rounded-xl cursor-pointer border-0 p-0.5"
                    style={{ background:'transparent' }} />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['#f472b6','#a78bfa','#60a5fa','#34d399','#fb923c','#facc15','#f87171','#e879f9'].map(c => (
                    <button key={c} onClick={()=>setNewRoleColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background:c, borderColor: newRoleColor===c ? '#fff' : 'transparent' }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={()=>setShowAddRole(false)} className="btn-secondary flex-1 justify-center">Отмена</button>
                <button onClick={addRole} className="btn-primary flex-1 justify-center">Создать</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Admin
