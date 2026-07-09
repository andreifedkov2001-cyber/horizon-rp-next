import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

const NEWS = [
  { tag: 'Обновление', tagColor: 'rgba(109,93,251,0.15)', tagText: '#a78bfa', top: 'from-purple-500', date: '5 июля 2024',
    title: 'Обновление 3.0 — Новые районы и профессии',
    desc: 'Добавлены 3 новых района, 47 автомобилей, 5 профессий и полностью переработана система полиции.' },
  { tag: 'Событие', tagColor: 'rgba(0,210,255,0.12)', tagText: '#67e8f9', top: 'from-cyan-500', date: '1 июля 2024',
    title: 'Летний фестиваль — призы и турниры',
    desc: 'Весь июль проходит летний фестиваль с гонками, турнирами и уникальными наградами.' },
  { tag: 'Патч', tagColor: 'rgba(52,211,153,0.12)', tagText: '#6ee7b7', top: 'from-emerald-500', date: '28 июня 2024',
    title: 'Патч 2.9.5 — Исправления и оптимизация',
    desc: 'Исправлены критические баги, улучшена производительность сервера.' },
]

const gradMap: Record<string, string> = { 'from-purple-500': '#a855f7', 'from-cyan-500': '#06b6d4', 'from-emerald-500': '#10b981' }

export default function News() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
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
          {NEWS.map((n, i) => (
            <motion.article key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }} className="glass-card overflow-hidden cursor-pointer">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${gradMap[n.top]}, transparent)` }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                    style={{ background: n.tagColor, color: n.tagText, borderColor: n.tagColor }}>
                    {n.tag}
                  </span>
                  <span className="text-xs" style={{ color: '#A9B0C2' }}>{n.date}</span>
                </div>
                <h3 className="font-manrope font-bold text-base mb-3 leading-snug">{n.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#A9B0C2' }}>{n.desc}</p>
                <div className="flex items-center gap-1 text-sm font-medium" style={{ color: '#6D5DFB' }}>
                  Читать далее
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
