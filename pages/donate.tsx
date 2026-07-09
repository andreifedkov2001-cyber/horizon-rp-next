import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PLANS = [
  { id: 'starter', name: 'Стартер', price: 199, coins: 2000, badge: null,
    perks: ['2 000 HorizonCoin', 'Префикс [VIP] в чате', 'Доступ к VIP-зоне', 'Уникальный номерной знак', 'Приоритетный вход'] },
  { id: 'premium', name: 'Премиум', price: 499, coins: 6000, badge: 'Популярный',
    perks: ['6 000 HorizonCoin', 'Префикс [PREMIUM]', 'Уникальный скин авто', 'Закрытые зоны', 'Увеличенный инвентарь', 'Бонус опыта ×1.5', 'Приоритетный вход'] },
  { id: 'elite', name: 'Элита', price: 999, coins: 15000, badge: 'Лучший выбор',
    perks: ['15 000 HorizonCoin', 'Префикс [ELITE]', 'Эксклюзивный автомобиль', 'Личный апартамент', 'Бонус опыта ×2.0', 'Скидка 10% в магазине', 'Бесплатный варп', 'Персональный менеджер'] },
]

const SHOP = [
  { icon: '🚗', name: 'Суперкар Pegassi',       price: 299, cat: 'Транспорт' },
  { icon: '🏠', name: 'Пентхаус в центре',       price: 599, cat: 'Недвижимость' },
  { icon: '💎', name: 'Бриллиантовый кейс',      price: 149, cat: 'Кейсы' },
  { icon: '🎭', name: 'Уникальный скин',          price: 99,  cat: 'Внешний вид' },
  { icon: '⚡', name: 'Буст опыта ×2 (7 дней)',  price: 199, cat: 'Буст' },
  { icon: '🔑', name: 'VIP статус (30 дней)',     price: 399, cat: 'Статус' },
]

const Donate: NextPage = () => {
  const [tab, setTab] = useState<'plans'|'shop'>('plans')

  return (
    <>
      <Head><title>Донат — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#090B10' }}>
        <Header />
        <section className="pt-24 pb-12 relative"
          style={{ background: 'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom: '1px solid rgba(109,93,251,0.1)' }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="section-title mb-3">Магазин <span className="gradient-text">доната</span></h1>
              <p style={{ color: '#A9B0C2' }}>Поддержи сервер и получи уникальные привилегии</p>
            </motion.div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex gap-2 mb-10 p-1.5 rounded-2xl w-fit mx-auto"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['plans','shop'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={tab === t ? { background: 'linear-gradient(135deg,#6D5DFB,#00D2FF)', color: '#fff' } : { color: '#A9B0C2' }}>
                {t === 'plans' ? '💎 Подписки' : '🛒 Магазин'}
              </button>
            ))}
          </div>

          {tab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {PLANS.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`glass-card p-6 relative flex flex-col ${i === 1 ? 'md:scale-105 md:z-10' : ''}`}
                  style={{ border: i === 1 ? '1px solid rgba(109,93,251,0.4)' : undefined }}>
                  {p.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full"
                      style={{ background: 'linear-gradient(135deg,#6D5DFB,#00D2FF)', color: '#fff' }}>
                      {p.badge}
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="font-manrope font-black text-2xl mb-2">{p.name}</h3>
                    <div className="font-manrope font-black text-5xl gradient-text mb-1">{p.price}₽</div>
                    <div className="text-sm" style={{ color: '#A9B0C2' }}>разово</div>
                    <div className="mt-2 text-sm font-semibold" style={{ color: '#00D2FF' }}>+{p.coins.toLocaleString('ru-RU')} HorizonCoin</div>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {p.perks.map((pk, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#6D5DFB' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        <span style={{ color: '#A9B0C2' }}>{pk}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={i === 1 ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                    Купить {p.name}
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'shop' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SHOP.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-card p-5 flex items-center gap-4">
                  <div className="text-4xl flex-shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs mb-1" style={{ color: '#A9B0C2' }}>{s.cat}</div>
                    <div className="font-semibold text-sm mb-3">{s.name}</div>
                    <button className="btn-primary text-xs py-2 px-4">{s.price}₽</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 glass-card p-6 flex flex-wrap gap-6 justify-center text-center">
            {[['🔒','Безопасная оплата'],['⚡','Мгновенное зачисление'],['💬','Поддержка 24/7'],['↩️','Возврат в течение 24ч']].map(([ic,tx],i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#A9B0C2' }}>
                <span className="text-xl">{ic}</span>{tx}
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Donate
