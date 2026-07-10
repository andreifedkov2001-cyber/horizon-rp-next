import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useAuth } from '../../../context/AuthContext'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  объявление: { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
  вопрос:     { bg: 'rgba(96,165,250,0.15)',  color: '#93c5fd' },
  идея:       { bg: 'rgba(251,191,36,0.15)',  color: '#fcd34d' },
  обсуждение: { bg: 'rgba(52,211,153,0.15)',  color: '#6ee7b7' },
  жалоба:     { bg: 'rgba(248,113,113,0.15)', color: '#fca5a5' },
}

const ROLE_LABELS: Record<string, string> = {
  Admin: '👑 Администратор', Moder: '🛡 Модератор', Player: '🎮 Игрок'
}

const ls = {
  get: (k: string, fb: any) => { try { return JSON.parse(localStorage.getItem(k)||'null')??fb } catch { return fb } },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
}

function getAvatar(nick: string): string | null {
  try {
    const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
    return users.find((u: any) => u.nick === nick)?.avatar || null
  } catch { return null }
}

const TopicPage: NextPage = () => {
  const { topicId } = useRouter().query as { topicId: string }
  const router = useRouter()
  const { user, openAuth } = useAuth()
  const [topic, setTopic]   = useState<any>(null)
  const [reply, setReply]   = useState('')
  const [loading, setLoading] = useState(true)

  const isAdmin = user && (user.role === 'Admin' || user.role === 'Moder')

  useEffect(() => {
    if (!topicId) return
    const all = ls.get('hrp_topics', [])
    const t = all.find((x: any) => x.id === topicId)
    if (t) {
      // Увеличиваем просмотры
      t.views = (t.views || 0) + 1
      ls.set('hrp_topics', all)
      setTopic({ ...t })
    }
    setLoading(false)
  }, [topicId])

  const sendReply = () => {
    if (!user) { openAuth('login'); return }
    if (!reply.trim()) return
    const all = ls.get('hrp_topics', [])
    const idx = all.findIndex((x: any) => x.id === topicId)
    if (idx === -1) return
    const post = {
      author: user.nick,
      role: user.role || 'Player',
      date: new Date().toLocaleString('ru-RU'),
      text: reply.trim(),
      likes: 0
    }
    all[idx].posts = [...(all[idx].posts || []), post]
    ls.set('hrp_topics', all)
    setTopic({ ...all[idx] })
    setReply('')
  }

  const deletePost = (i: number) => {
    if (!confirm('Удалить сообщение?')) return
    const all = ls.get('hrp_topics', [])
    const idx = all.findIndex((x: any) => x.id === topicId)
    if (idx === -1) return
    all[idx].posts.splice(i, 1)
    ls.set('hrp_topics', all)
    setTopic({ ...all[idx] })
  }

  const likePost = (i: number) => {
    const all = ls.get('hrp_topics', [])
    const idx = all.findIndex((x: any) => x.id === topicId)
    if (idx === -1) return
    all[idx].posts[i].likes = (all[idx].posts[i].likes || 0) + 1
    ls.set('hrp_topics', all)
    setTopic({ ...all[idx] })
  }

  const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#090B10' }}>
      <div className="text-sm" style={{ color: '#A9B0C2' }}>Загрузка...</div>
    </div>
  )

  if (!topic) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#090B10' }}>
      <div className="text-5xl">💬</div>
      <p style={{ color: '#A9B0C2' }}>Тема не найдена</p>
      <button onClick={() => router.back()} className="btn-secondary px-6 py-2.5 text-sm">← Назад</button>
    </div>
  )

  return (
    <>
      <Head><title>{topic.title} — Форум Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#090B10' }}>
        <Header />

        {/* Hero */}
        <section className="pt-24 pb-10 relative"
          style={{ background: 'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom: '1px solid rgba(109,93,251,0.1)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-2 text-sm mb-4 flex-wrap" style={{ color: '#A9B0C2' }}>
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span>›</span>
              <Link href="/forum" className="hover:text-white transition-colors">Форум</Link>
              <span>›</span>
              <Link href={`/forum/${topic.catId}`} className="hover:text-white transition-colors">{topic.catId}</Link>
              <span>›</span>
              <span className="text-white truncate max-w-xs">{topic.title}</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-manrope font-black text-2xl md:text-3xl mb-3 leading-tight">{topic.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {topic.tag && TAG_COLORS[topic.tag] && (
                  <span className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: TAG_COLORS[topic.tag].bg, color: TAG_COLORS[topic.tag].color }}>
                    {topic.tag}
                  </span>
                )}
                <span className="text-sm" style={{ color: '#A9B0C2' }}>
                  {topic.author} · {topic.date} · 👁 {topic.views || 0}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-6 py-10">
          {/* Посты */}
          <div className="flex flex-col gap-4 mb-8">
            {(topic.posts || []).map((p: any, i: number) => {
              const av = getAvatar(p.author)
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card overflow-hidden">
                  {/* Шапка поста */}
                  <div className="flex items-center gap-4 px-5 py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    {/* Аватарка */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                      style={{ background: av ? 'transparent' : 'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>
                      {av ? <img src={av} alt={p.author} className="w-full h-full object-cover" /> : (p.author||'?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{p.author}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#A9B0C2' }}>
                        {ROLE_LABELS[p.role] || '🎮 Игрок'} · {p.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs" style={{ color: '#A9B0C2' }}>#{i + 1}</span>
                      {i === 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(109,93,251,0.15)', color: '#a78bfa', border: '1px solid rgba(109,93,251,0.3)' }}>
                          ОП
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Текст поста */}
                  <div className="px-5 py-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#e0dff0' }}>{p.text}</p>
                  </div>

                  {/* Футер поста */}
                  <div className="flex items-center gap-3 px-5 py-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <button onClick={() => likePost(i)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#A9B0C2' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f472b6', e.currentTarget.style.borderColor = 'rgba(244,114,182,0.4)')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A9B0C2', e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                      ❤️ {p.likes || 0}
                    </button>
                    <button
                      onClick={() => setReply(`> ${p.author} написал:\n> ${p.text}\n\n`)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#A9B0C2' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A9B0C2')}>
                      ↩ Цитировать
                    </button>
                    {isAdmin && (
                      <button onClick={() => deletePost(i)}
                        className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                        🗑 Удалить
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Форма ответа */}
          <div className="glass-card p-6">
            <h3 className="font-manrope font-bold text-lg mb-4">✏️ Написать ответ</h3>
            {user ? (
              <div className="flex flex-col gap-3">
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={5}
                  placeholder="Напиши свой ответ..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={inp}
                  onKeyDown={e => { if (e.key === 'Enter' && e.shiftKey) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }} />
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#A9B0C2' }}>Shift+Enter — новая строка</span>
                  <button onClick={sendReply} className="btn-primary text-sm px-6 py-2.5">Отправить</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm mb-4" style={{ color: '#A9B0C2' }}>Войди чтобы написать ответ</p>
                <button onClick={() => openAuth('login')} className="btn-primary text-sm px-6 py-2.5">Войти</button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default TopicPage
