import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

const STATS = [
  { icon: '🟢', val: 1247, suffix: '', label: 'Онлайн сейчас', color: 'text-green-400' },
  { icon: '👥', val: 50000, suffix: '+', label: 'Зарегистрировано', color: 'gradient-text' },
  { icon: '🖥️', val: 3, suffix: '', label: 'Игровых сервера', color: 'text-cyan-400' },
  { icon: '💬', val: 12500, suffix: '+', label: 'Discord участников', color: 'text-purple-400' },
]

export default function Stats() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h2 className="section-title mb-3">Horizon RP в <span className="gradient-text">цифрах</span></h2>
          <p style={{ color: '#A9B0C2' }}>Живое сообщество которое растёт каждый день</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className={`font-manrope font-black text-4xl mb-2 ${s.color}`}>
                {inView ? <CountUp end={s.val} duration={2.5} separator=" " suffix={s.suffix} /> : '0'}
              </div>
              <div className="text-sm font-medium" style={{ color: '#A9B0C2' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
