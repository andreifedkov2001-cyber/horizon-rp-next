import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CATS = [
  { id: 'news', icon: '📢', name: 'Правила проекта Horizon RP', desc: 'Официальные правила и объявления', topics: 12, posts: 48, pinned: true },
  { id: 'washington', icon: '💬', name: 'Horizon RP | Washington', desc: 'Обсуждение штата Вашингтон', topics: 34, posts: 127, pinned: false,
    subs: [
      { id: 'law',       icon: '⚖️',  name: 'Законодательная база',     desc: 'Законы и нормативные акты' },
      { id: 'politics',  icon: '🏛️', name: 'Политическая жизнь штата', desc: 'Политика и управление' },
      { id: 'judicial',  icon: '🔨',  name: 'Судебная власть',           desc: 'Суды, дела и приговоры' },
      { id: 'executive', icon: '🏢',  name: 'Исполнительная власть',     desc: 'Губернатор и органы власти' },
    ]},
  { id: 'general', icon: '💡', name: 'Общий раздел',      desc: 'Общение и предложения',     topics: 89, posts: 312, pinned: false },
  { id: 'tech',    icon: '🎭', name: 'Технический раздел', desc: 'Баги, вопросы, техподдержка', topics: 56, posts: 201, pinned: false },
]

const Forum: NextPage = () => {
  const [open, setOpen] = useState<Record<string,boolean>>({})
  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }))

  return (
    <>
      <Head><title>Форум — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#090B10' }}>
        <Header />
        <section className="pt-24 pb-12 relative"
          style={{ background: 'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom: '1px solid rgba(109,93,251,0.1)' }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="section-title mb-3">Форум <span className="gradient-text">Horizon RP</span></h1>
              <p style={{ color: '#A9B0C2' }}>Общайся, предлагай идеи и обсуждай жизнь сервера</p>
            </motion.div>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex gap-3 mb-8 flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(18,21,29,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#A9B0C2' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Поиск по форуму..."
                className="bg-transparent outline-none text-sm w-full placeholder-gray-500 text-white" />
            </div>
            <button className="btn-primary text-sm px-6 py-3">+ Новая тема</button>
          </div>

          <div className="flex flex-col gap-4">
            {CATS.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} className="glass-card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                  <Link href={`/forum/${cat.id}`} className="flex-1 min-w-0 group">
                    <div className="font-manrope font-bold text-base flex items-center gap-2 group-hover:text-purple-400 transition-colors">
                      {cat.name}
                      {cat.pinned && <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(109,93,251,0.15)', color: '#a78bfa', border: '1px solid rgba(109,93,251,0.3)' }}>Закреплено</span>}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: '#A9B0C2' }}>{cat.desc}</div>
                  </Link>
                  <div className="text-sm flex-shrink-0 hidden sm:block" style={{ color: '#A9B0C2' }}>
                    {cat.topics} тем · {cat.posts} сообщ.
                  </div>
                  {(cat as any).subs ? (
                    <button onClick={() => toggle(cat.id)}
                      className="flex items-center gap-1 text-xs font-semibold flex-shrink-0 ml-2 transition-colors"
                      style={{ color: '#6D5DFB' }}>
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
                {(cat as any).subs && open[cat.id] && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {(cat as any).subs.map((s: any) => (
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{ l: 'Тем', v: '191' }, { l: 'Сообщений', v: '688' }, { l: 'Участников', v: '50 000' }, { l: 'Онлайн', v: '1 244' }].map((s, i) => (
              <div key={i}>
                <div className="font-manrope font-black text-2xl gradient-text">{s.v}</div>
                <div className="text-sm mt-1" style={{ color: '#A9B0C2' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Forum
