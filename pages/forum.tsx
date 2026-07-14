import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

interface Cat { id: string; icon: string; name: string; desc: string; topics: number; posts: number; pinned: boolean; subs?: Sub[] }
interface Sub { id: string; icon: string; name: string; desc: string }

const DEFAULT_CATS: Cat[] = [
  { id: 'news',      icon: '📢', name: 'Правила проекта Horizon RP', desc: 'Официальные правила и объявления', topics: 12, posts: 48,  pinned: true },
  { id: 'washington',icon: '💬', name: 'Horizon RP | Washington',    desc: 'Обсуждение штата Вашингтон',       topics: 34, posts: 127, pinned: false,
    subs: [
      { id: 'law',       icon: '⚖️',  name: 'Законодательная база',     desc: 'Законы и нормативные акты' },
      { id: 'politics',  icon: '🏛️', name: 'Политическая жизнь штата', desc: 'Политика и управление' },
      { id: 'judicial',  icon: '🔨',  name: 'Судебная власть',           desc: 'Суды, дела и приговоры' },
      { id: 'executive', icon: '🏢',  name: 'Исполнительная власть',     desc: 'Губернатор и органы власти' },
    ]},
  { id: 'general', icon: '💡', name: 'Общий раздел',      desc: 'Общение и предложения',      topics: 89, posts: 312, pinned: false },
  { id: 'tech',    icon: '🎭', name: 'Технический раздел', desc: 'Баги, вопросы, техподдержка', topics: 56, posts: 201, pinned: false },
]

const ls = {
  get: (k: string, fb: any) => { try { return JSON.parse(localStorage.getItem(k)||'null')??fb } catch { return fb } },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
}

const Forum: NextPage = () => {
  const { user, openAuth } = useAuth()
  const [open, setOpen]       = useState<Record<string,boolean>>({})
  const [cats, setCats]       = useState<Cat[]>(DEFAULT_CATS)
  const [search, setSearch]   = useState('')

  // Модалка новой темы
  const [showTopic, setShowTopic]   = useState(false)
  const [tCat, setTCat]   = useState('')
  const [tTitle, setTTitle] = useState('')
  const [tTag, setTTag]   = useState('')
  const [tText, setTText]   = useState('')

  // Модалка новой категории
  const [showCat, setShowCat]     = useState(false)
  const [cIcon, setCIcon]   = useState('📂')
  const [cName, setCName]   = useState('')
  const [cDesc, setCDesc]   = useState('')

  const isAdmin = user && (user.role === 'Admin' || user.role === 'Moder')

  useEffect(() => {
    const stored = ls.get('hrp_forum_cats', null)
    if (stored) setCats(stored)
  }, [])

  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }))

  const submitTopic = () => {
    if (!user) { openAuth('login'); return }
    if (!tTitle.trim() || !tCat) return
    const topics = ls.get('hrp_topics', [])
    const now = new Date()
    topics.push({
      id: 't' + Date.now(),
      catId: tCat,
      title: tTitle,
      author: user.nick,
      role: user.role,
      date: now.toISOString().slice(0,10),
      tag: tTag,
      pinned: false,
      views: 0,
      posts: [{ author: user.nick, role: user.role, date: now.toLocaleString('ru-RU'), text: tText, likes: 0 }]
    })
    ls.set('hrp_topics', topics)
    setShowTopic(false); setTCat(''); setTTitle(''); setTTag(''); setTText('')
    alert('Тема создана!')
  }

  const submitCat = () => {
    if (!cName.trim()) return
    const newCat: Cat = { id: 'cat' + Date.now(), icon: cIcon || '📂', name: cName, desc: cDesc, topics: 0, posts: 0, pinned: false }
    const next = [...cats, newCat]
    setCats(next); ls.set('hrp_forum_cats', next)
    setShowCat(false); setCIcon('📂'); setCName(''); setCDesc('')
  }

  const filtered = cats.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  )

  const overlay = 'fixed inset-0 z-[200] flex items-center justify-center p-4'
  const modalBg = { background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }
  const modalCard = { background: 'rgba(18,21,29,0.98)', border: '1px solid rgba(124,58,237,0.2)' }
  const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }

  return (
    <>
      <Head><title>Форум — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />

        <section className="pt-24 pb-12 relative"
          style={{ background: 'linear-gradient(135deg,#0a0a0f 0%,#0e0a18 100%)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="section-title mb-3">Форум <span className="gradient-text">Horizon RP</span></h1>
              <p style={{ color: '#A9B0C2' }}>Общайся, предлагай идеи и обсуждай жизнь сервера</p>
            </motion.div>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* Тулбар */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(18,21,29,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                type="text" placeholder="Поиск по форуму..."
                className="bg-transparent outline-none text-sm w-full placeholder-gray-500 text-white" />
            </div>
            {isAdmin && (
              <button onClick={() => setShowCat(true)}
                className="btn-secondary text-sm px-5 py-3">
                📂 Категория
              </button>
            )}
            <button onClick={() => user ? setShowTopic(true) : openAuth('login')}
              className="btn-primary text-sm px-6 py-3">
              + Новая тема
            </button>
          </div>

          {/* Категории */}
          <div className="flex flex-col gap-4">
            {filtered.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} className="glass-card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                  <Link href={`/forum/${cat.id}`} className="flex-1 min-w-0 group">
                    <div className="font-manrope font-bold text-base flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                      {cat.name}
                      {cat.pinned && <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>Закреплено</span>}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: '#A9B0C2' }}>{cat.desc}</div>
                  </Link>
                  <div className="text-sm flex-shrink-0 hidden sm:block" style={{ color: '#A9B0C2' }}>
                    {cat.topics} тем · {cat.posts} сообщ.
                  </div>
                  {cat.subs ? (
                    <button onClick={() => toggle(cat.id)}
                      className="flex items-center gap-1 text-xs font-semibold flex-shrink-0 ml-2 transition-colors"
                      style={{ color: '#7c3aed' }}>
                      Подразделы
                      <svg className={`w-4 h-4 transition-transform ${open[cat.id] ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                  ) : (
                    <Link href={`/forum/${cat.id}`} className="flex-shrink-0">
                      <svg className="w-5 h-5" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </Link>
                  )}
                </div>

                {cat.subs && open[cat.id] && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {cat.subs.map(s => (
                      <Link key={s.id} href={`/forum/${s.id}`}
                        className="flex items-center gap-4 px-5 py-3 group transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span className="text-lg flex-shrink-0 ml-4">{s.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-purple-400 transition-colors">{s.name}</div>
                          <div className="text-xs" style={{ color: '#A9B0C2' }}>{s.desc}</div>
                        </div>
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>


        </main>
        <Footer />
      </div>

      {/* ===== МОДАЛКА: НОВАЯ ТЕМА ===== */}
      <AnimatePresence>
        {showTopic && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={overlay} style={modalBg} onClick={() => setShowTopic(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6" style={modalCard}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-manrope font-bold text-lg">✏️ Новая тема</h3>
                <button onClick={() => setShowTopic(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#A9B0C2' }}>✕</button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Категория</label>
                  <select value={tCat} onChange={e => setTCat(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ ...inp, background: 'rgba(18,21,29,0.9)' }}>
                    <option value="">— выбери категорию —</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Заголовок</label>
                  <input value={tTitle} onChange={e => setTTitle(e.target.value)}
                    placeholder="Введи заголовок темы..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inp} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Тег</label>
                  <select value={tTag} onChange={e => setTTag(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ ...inp, background: 'rgba(18,21,29,0.9)' }}>
                    <option value="">— без тега —</option>
                    {['вопрос','идея','обсуждение','жалоба','объявление'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Сообщение</label>
                  <textarea value={tText} onChange={e => setTText(e.target.value)} rows={5}
                    placeholder="Напиши своё сообщение..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none" style={inp} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowTopic(false)} className="btn-secondary flex-1 justify-center">Отмена</button>
                  <button onClick={submitTopic} className="btn-primary flex-1 justify-center">Опубликовать</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== МОДАЛКА: НОВАЯ КАТЕГОРИЯ ===== */}
      <AnimatePresence>
        {showCat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={overlay} style={modalBg} onClick={() => setShowCat(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6" style={modalCard}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-manrope font-bold text-lg">📂 Создать категорию</h3>
                <button onClick={() => setShowCat(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#A9B0C2' }}>✕</button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Иконка (эмодзи)</label>
                  <input value={cIcon} onChange={e => setCIcon(e.target.value)} maxLength={4}
                    placeholder="📂" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inp} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Название</label>
                  <input value={cName} onChange={e => setCName(e.target.value)}
                    placeholder="Название категории..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inp} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Описание</label>
                  <input value={cDesc} onChange={e => setCDesc(e.target.value)}
                    placeholder="Краткое описание..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inp} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCat(false)} className="btn-secondary flex-1 justify-center">Отмена</button>
                  <button onClick={submitCat} className="btn-primary flex-1 justify-center">Создать</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Forum
