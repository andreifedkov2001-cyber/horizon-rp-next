import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

interface NewsItem {
  id: string
  tag: string
  tagColor: string
  date: string
  title: string
  desc: string
}

const DEFAULT_NEWS: NewsItem[] = [
  { id: 'n1', tag: 'Обновление', tagColor: '#a78bfa', date: '5 июля 2024', title: 'Обновление 3.0 — Новые районы и профессии', desc: 'Добавлены 3 новых района, 47 автомобилей, 5 профессий и полностью переработана система полиции.' },
  { id: 'n2', tag: 'Событие',    tagColor: '#67e8f9', date: '1 июля 2024',  title: 'Летний фестиваль — призы и турниры',           desc: 'Весь июль проходит летний фестиваль с гонками, турнирами и уникальными наградами.' },
  { id: 'n3', tag: 'Патч',       tagColor: '#6ee7b7', date: '28 июня 2024', title: 'Патч 2.9.5 — Исправления и оптимизация',        desc: 'Исправлены критические баги, улучшена производительность сервера.' },
]

export default function News() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hrp_news')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setNews(parsed)
      } else {
        // При первом запуске сохраняем дефолтные новости в localStorage
        localStorage.setItem('hrp_news', JSON.stringify(DEFAULT_NEWS))
      }
    } catch {}
  }, [])

  const displayed = news.slice(0, 3)

  if (!displayed.length) return null

  return (
    <section ref={ref} className="py-24" style={{ background: '#090B10' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(109,93,251,0.1)', border: '1px solid rgba(109,93,251,0.2)' }}>
              <span className="text-sm font-semibold gradient-text">Последние новости</span>
            </div>
            <h2 className="section-title">Что нового в <span className="gradient-text">Horizon RP</span></h2>
          </div>
          <Link href="/news" className="btn-secondary px-6 py-3 text-sm">Все новости →</Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayed.map((n, i) => (
            <motion.article key={n.id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }} className="glass-card overflow-hidden cursor-pointer">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${n.tagColor}, transparent)` }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: n.tagColor + '22', color: n.tagColor, border: `1px solid ${n.tagColor}44` }}>
                    {n.tag}
                  </span>
                  <span className="text-xs" style={{ color: '#A9B0C2' }}>{n.date}</span>
                </div>
                <h3 className="font-manrope font-bold text-base mb-3 leading-snug">{n.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#A9B0C2' }}>{n.desc}</p>
                <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#6D5DFB' }}>
                  Читать далее
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
