import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'

interface User { id: string; nick: string; email: string; role: string; joined: string; banned?: boolean }
interface Log  { time: string; type: 'auth'|'forum'|'admin'; text: string }

const ls = {
  get: (k: string, fb: any = []) => { try { return JSON.parse(localStorage.getItem(k)||'null')??fb } catch { return fb } },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
}

const ROLE_COLORS: Record<string,{ bg:string; color:string }> = {
  Admin:  { bg:'rgba(244,114,182,0.12)', color:'#f472b6' },
  Moder:  { bg:'rgba(167,139,250,0.12)', color:'#a78bfa' },
  Player: { bg:'rgba(96,165,250,0.12)',  color:'#60a5fa' },
}

const Admin: NextPage = () => {
  const { user } = useAuth()
  const router   = useRouter()
  const [tab, setTab]   = useState<'stats'|'users'|'logs'|'settings'>('stats')
  const [users, setUsers]     = useState<User[]>([])
  const [logs, setLogs]       = useState<Log[]>([])
  const [uSearch, setUSearch] = useState('')
  const [lSearch, setLSearch] = useState('')
  const [lType, setLType]     = useState('')
  const [editU, setEditU]     = useState<User|null>(null)
  const [eRole, setERole]     = useState('')
  const [eBan, setEBan]       = useState(false)
  const [cfg, setCfg]         = useState({ forumName: 'Horizon RP Forum', perPage: 15, regOpen: true })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const s = ls.get('hrp_session', null)
    if (!s || (s.role !== 'Admin' && s.role !== 'Moder')) { router.push('/'); return }
    setUsers(ls.get('hrp_users', []))
    setLogs([...ls.get('hrp_logs', [])].reverse())
    const c = ls.get('hrp_settings', null); if (c) setCfg(c)
  }, [])

  if (!user || (user.role !== 'Admin' && user.role !== 'Moder')) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#090B10' }}>
      <div className="text-6xl">🚫</div>
      <h1 className="font-manrope font-black text-2xl">Доступ запрещён</h1>
      <p className="text-sm" style={{ color: '#A9B0C2' }}>Только для администраторов</p>
      <button onClick={() => router.push('/')} className="btn-primary px-6 py-2.5 text-sm">На главную</button>
    </div>
  )

  const topics = ls.get('hrp_topics', [])
  const posts  = topics.reduce((s: number, t: any) => s + (t.posts?.length||0), 0)

  const addLog = (type: Log['type'], text: string) => {
    const all: Log[] = ls.get('hrp_logs', [])
    const entry: Log = { type, text, time: new Date().toLocaleString('ru-RU') }
    const next = [...all, entry].slice(-500)
    ls.set('hrp_logs', next); setLogs([...next].reverse())
  }

  const openEdit = (u: User) => { setEditU(u); setERole(u.role); setEBan(!!u.banned) }
  const saveEdit = () => {
    if (!editU) return
    const next = users.map(u => u.id === editU.id ? { ...u, role: eRole, banned: eBan } : u)
    setUsers(next); ls.set('hrp_users', next)
    addLog('admin', `${user.nick} изменил ${editU.nick}: роль=${eRole}${eBan?' [БАН]':''}`)
    setEditU(null)
  }
  const toggleBan = (u: User) => {
    const next = users.map(x => x.id === u.id ? { ...x, banned: !x.banned } : x)
    setUsers(next); ls.set('hrp_users', next)
    addLog('admin', `${user.nick} ${u.banned?'разбанил':'забанил'} ${u.nick}`)
  }

  const fUsers = users.filter(u => !uSearch || u.nick.toLowerCase().includes(uSearch.toLowerCase()) || u.email.toLowerCase().includes(uSearch.toLowerCase()))
  const fLogs  = logs.filter(l => (!lSearch || l.text.toLowerCase().includes(lSearch.toLowerCase())) && (!lType || l.type === lType))

  const TABS = [{ id:'stats',label:'📊 Статистика'},{id:'users',label:'👥 Пользователи'},{id:'logs',label:'📋 Логи'},{id:'settings',label:'⚙️ Настройки'}] as const

  const inputStyle = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff' }
  const logTypeStyle = (t: string) => {
    if (t==='admin') return { background:'rgba(244,114,182,0.12)', color:'#f472b6', border:'1px solid rgba(244,114,182,0.25)' }
    if (t==='auth')  return { background:'rgba(96,165,250,0.12)',  color:'#60a5fa', border:'1px solid rgba(96,165,250,0.25)' }
    return { background:'rgba(52,211,153,0.12)', color:'#6ee7b7', border:'1px solid rgba(52,211,153,0.25)' }
  }

  return (
    <>
      <Head><title>Админ панель — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#090B10' }}>
        <Header />
        <section className="pt-24 pb-6" style={{ background:'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom:'1px solid rgba(109,93,251,0.1)' }}>
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
                style={tab===t.id ? {background:'linear-gradient(135deg,#6D5DFB,#00D2FF)',color:'#fff'} : {background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#A9B0C2'}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* СТАТИСТИКА */}
          {tab==='stats' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[['👥',users.length,'Пользователей'],['💬',topics.length,'Тем'],['📝',posts,'Сообщений'],
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
              <div className="flex gap-3 mb-5 flex-wrap">
                <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background:'rgba(18,21,29,0.8)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color:'#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={uSearch} onChange={e=>setUSearch(e.target.value)} placeholder="Поиск по нику..."
                    className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" />
                </div>
              </div>
              <div className="glass-card overflow-hidden">
                {fUsers.map(u=>(
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3 flex-wrap" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>{u.nick[0].toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                        {u.nick}
                        {u.banned && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(248,113,113,0.12)',color:'#f87171',border:'1px solid rgba(248,113,113,0.25)' }}>Забанен</span>}
                      </div>
                      <div className="text-xs" style={{ color:'#A9B0C2' }}>{u.email} · {u.joined}</div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold" style={ROLE_COLORS[u.role]||ROLE_COLORS.Player}>{u.role}</span>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={()=>openEdit(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff' }}>✏️ Изменить</button>
                      <button onClick={()=>toggleBan(u)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={u.banned ? {background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.25)',color:'#6ee7b7'} : {background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.25)',color:'#f87171'}}>
                        {u.banned ? '✅ Разбан' : '🚫 Бан'}
                      </button>
                    </div>
                  </div>
                ))}
                {!fUsers.length && <div className="px-5 py-10 text-center text-sm" style={{ color:'#A9B0C2' }}>Ничего не найдено</div>}
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
                <button onClick={()=>{ ls.set('hrp_logs',[]); setLogs([]) }}
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
                  <button onClick={()=>{ ls.set('hrp_settings',cfg); addLog('admin',`${user.nick} обновил настройки`) }}
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
                      style={{ background: cfg.regOpen ? '#6D5DFB' : 'rgba(255,255,255,0.1)' }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                        style={{ left: cfg.regOpen ? '22px' : '2px' }} />
                    </button>
                  </div>
                  <button onClick={()=>{ ls.set('hrp_settings',cfg); addLog('admin',`${user.nick} обновил настройки`) }}
                    className="btn-primary justify-center mt-2">💾 Сохранить</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Модалка редактирования */}
      {editU && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}>
          <motion.div initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background:'rgba(18,21,29,0.98)', border:'1px solid rgba(109,93,251,0.2)' }}>
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
    </>
  )
}

export default Admin
