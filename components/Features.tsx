import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FEATURES = [
  { icon: '💰', title: 'Реалистичная экономика', desc: 'Банки, бизнесы, фондовый рынок, недвижимость. Каждое действие влияет на экономику города.', color: '#7c3aed' },
  { icon: '💼', title: 'Уникальные работы', desc: 'Более 50 профессий — от таксиста до наркоторговца. Стройте карьеру или уходите в криминал.', color: '#a78bfa' },
  { icon: '🚗', title: 'Большой автопарк', desc: 'Сотни машин, мотоциклов, лодок и вертолётов. Покупай, тюнингуй, гоняй.', color: '#7c3aed' },
  { icon: '🔄', title: 'Регулярные обновления', desc: 'Команда выпускает крупные обновления каждый месяц. Контент никогда не заканчивается.', color: '#a78bfa' },
  { icon: '👮', title: 'Живые фракции', desc: 'Полиция, ФБР, мафия, байкеры — реальные игроки управляют фракциями и властью.', color: '#7c3aed' },
  { icon: '🎭', title: 'Глубокий RolePlay', desc: 'Детально проработанные механики отыгрыша, судебная система, тюрьма и больница.', color: '#a78bfa' },
]

export default function Features() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <section ref={ref} className="py-24" style={{ background: '#0a0a0f' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <span className="text-sm font-semibold gradient-text">Почему Horizon RP</span>
          </div>
          <h2 className="section-title mb-4">Всё для <span className="gradient-text">идеального RolePlay</span></h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A9B0C2' }}>
            Мы создали сервер который даёт тебе полную свободу в живом и дышащем городе
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }} className="glass-card p-6">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-manrope font-bold text-lg mb-3">{f.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color: '#A9B0C2' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
