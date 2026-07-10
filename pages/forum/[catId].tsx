import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

const CATS: Record<string, { icon: string; name: string; desc: string }> = {
  news:       { icon: '📢', name: 'Правила проекта Horizon RP', desc: 'Официальные правила и объявления' },
  washington: { icon: '💬', name: 'Horizon RP | Washington',    desc: 'Обсуждение штата Вашингтон' },
  law:        { icon: '⚖️', name: 'Законодательная база',       desc: 'Законы и нормативные акты штата' },
  politics:   { icon: '🏛️', name: 'Политическая жизнь штата',  desc: 'Политика и управление' },
  judicial:   { icon: '🔨', name: 'Судебная власть',            desc: 'Суды, дела и приговоры' },
  executive:  { icon: '🏢', name: 'Исполнительная власть',      desc: 'Губернатор и органы власти' },
  general:    { icon: '💡', name: 'Общий раздел',               desc: 'Общение и предложения' },
  tech:       { icon: '🎭', name: 'Технический раздел',         desc: 'Баги, вопросы, техподдержка' },
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  объявление: { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
  вопрос:     { bg: 'rgba(96,165,250,0.15)',  color: '#93c5fd' },
  идея:       { bg: 'rgba(251,191,36,0.15)',  color: '#fcd34d' },
  обсуждение: { bg: 'rgba(52,211,153,0.15)',  color: '#6ee7b7' },
  жалоба:     { bg: 'rgba(248,113,113,0.15)', color: '#fca5a5' },
}

const DEFAULT_TOPICS: Record<string, any[]> = {
  news: [
    { id: 't1', catId: 'news', title: 'Обновление 3.0 — Новые районы и профессии', author: 'Admin',    role: 'Admin', date: '05.07.2024', tag: 'объявление', pinned: true,  views: 3241, posts: [{author:'Admin',text:'Текст новости',date:'05.07.2024',likes:0}] },
    { id: 't2', catId: 'news', title: 'Правила форума и система предупреждений',    author: 'Moder',    role: 'Moder', date: '01.06.2024', tag: 'объявление', pinned: true,  views: 8900, posts: [{author:'Moder',text:'Правила',date:'01.06.2024',likes:0}] },
  ],
  general: [
    { id: 't3', catId: 'general', title: 'Кто как начинал? Расскажи свою историю',  author: 'DragOS',   role: 'Player', date: '07.07.2024', tag: 'обсуждение', pinned: false, views: 5402, posts: [] },
    { id: 't4', catId: 'general', title: 'Предложение: добавить систему репутации', author: 'RoleKing', role: 'Player', date: '05.07.2024', tag: 'идея',       pinned: false, views: 1943, posts: [] },
  ],
  tech: [
    { id: 't5', catId: 'tech', title: 'Как получить первую работу? Гайд', author: 'LightRP', role: 'Player', date: '02.07.2024', tag: 'вопрос', pinned: false, views: 1120, posts: [] },
  ],
}

const ls = {
  get: (k: string, fb: any) => { try { return JSON.parse(localStorage.getItem(k)||'null')??fb } catch { return fb } },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
}

const ForumCat: NextPage = () => {
  const { catId } = useRouter().query as { catId: string }
  const { user, openAuth } = useAuth()
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(false)
  const [title, setTitle]   = useState('')
  const [text, setText]     = useState('')
  const [tag, setTag]       = useState('')
  const [topics, setTopics] = useState<any[]>([])

  const cat = CATS[catId] || { icon: '📂', name: catId || '', desc: '' }

  // Загружаем темы из localStorage
  useEffect(() => {
    if (!catId) return
    const all = ls.get('hrp_topics', null)
    if (all && Array.isArray(all)) {
      setTopics(all.filter((t: any) => t.catId === catId))
    } else {
      // Первый запуск — берём дефолтные
      const defaults = Object.values(DEFAULT_TOPICS).flat()
      ls.set('hrp_topics', defaults)
      setTopics(defaults.filter((t: any) => t.catId === catId))
    }
  }, [catId])

  const submit = () => {
    if (!user) { openAuth('login'); return }
    if (!title.trim()) return

    const now = new Date()
    const newTopic = {
      id: 't' + Date.now(),
      catId,
      title: title.trim(),
      author: user.nick,
      role: user.role || 'Player',
      date: now.toLocaleDateString('ru-RU'),
      tag,
      pinned: false,
      views: 0,
      posts: [{ author: user.nick, role: user.role, date: now.toLocaleString('ru-RU'), text: text.trim(), likes: 0 }]
    }

    const all = ls.get('hrp_topics', [])
    const next = [newTopic, ...all]
    ls.set('hrp_topics', next)
    setTopics([newTopic, ...topics])
    setModal(false); setTitle(''); setText(''); setTag('')
  }

  const isAdmin = user && (user.role === 'Admin' || user.role === 'Moder')

  const deleteTopic = (id: string) => {
    if (!confirm('Удалить тему?')) return
    const all = ls.get('hrp_topics', [])
    ls.set('hrp_topics', all.filter((t: any) => t.id !== id))
    setTopics(topics.filter(t => t.id !== id))
  }

  const filtered = topics.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  )

  const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }

  return (
    <>
      <Head><title>{cat.name} — Форум Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#090B10' }}>
        <Header />

        <section className="pt-24 pb-10 relative"
          style={{ background: 'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom: '1px solid rgba(109,93,251,0.1)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#A9B0C2' }}>
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span>›</span>
              <Link href="/forum" className="hover:text-white transition-colors">Форум</Link>
              <span>›</span>
              <span className="text-white">{cat.name}</span>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="section-title flex items-center gap-3">
              <span>{cat.icon}</span>{cat.name}
            </motion.h1>
            <p className="mt-2" style={{ color: '#A9B0C2' }}>{cat.desc}</p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-6 pb-16 pt-8">
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex-1 min-w-[180px] flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(18,21,29,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по темам..."
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500" />
            </div>
            <button onClick={() => user ? setModal(true) : openAuth('login')} className="btn-primary text-sm px-6 py-2.5">
              + Новая тема
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3 opacity-40">💬</div>
                <p className="text-sm" style={{ color: '#A9B0C2' }}>Тем пока нет. Будь первым!</p>
              </div>
            ) : (
              filtered.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 group transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {t.pinned && <span className="text-sm flex-shrink-0" style={{ color: '#6D5DFB' }}>📌</span>}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>
                    {(t.author || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {}}>
                    <div className="font-semibold text-sm group-hover:text-purple-400 transition-colors truncate">{t.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs" style={{ color: '#A9B0C2' }}>{t.author}</span>
                      <span className="text-xs" style={{ color: '#A9B0C2' }}>· {t.date}</span>
                      {t.tag && TAG_COLORS[t.tag] && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: TAG_COLORS[t.tag].bg, color: TAG_COLORS[t.tag].color }}>
                          {t.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0 hidden sm:block" style={{ color: '#A9B0C2' }}>
                    💬 {(t.posts||[]).length} · 👁 {(t.views||0).toLocaleString('ru-RU')}
                  </div>
                  {isAdmin && (
                    <button onClick={() => deleteTopic(t.id)}
                      className="text-xs px-2 py-1 rounded-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                      🗑
                    </button>
                  )}
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </motion.div>
              ))
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Модалка создания темы */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'rgba(18,21,29,0.98)', border: '1px solid rgba(109,93,251,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-manrope font-bold text-lg">✏️ Новая тема</h3>
                <button onClick={() => setModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#A9B0C2' }}>✕</button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Заголовок</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Введи заголовок темы..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inp} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#A9B0C2' }}>Тег</label>
                  <select value={tag} onChange={e => setTag(e.target.value)}
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
                  <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
                    placeholder="Напиши своё сообщение..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none" style={inp} />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setModal(false)} className="btn-secondary flex-1 py-2.5 justify-center text-sm">Отмена</button>
                  <button onClick={submit} className="btn-primary flex-1 py-2.5 justify-center text-sm">Опубликовать</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ForumCat
