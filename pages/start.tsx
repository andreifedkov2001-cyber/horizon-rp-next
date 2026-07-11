import type { NextPage } from 'next'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

const STEPS = [
  {
    n: '01', icon: '⬇️', title: 'Скачай RAGE Multiplayer',
    desc: 'Перейди на официальный сайт RAGE Multiplayer и скачай лаунчер. Установка займёт пару минут.',
    link: { label: '↓ Скачать RAGE MP', url: 'https://rage.mp' },
    info: [
      { icon: '✅', text: 'Бесплатно' },
      { icon: '✅', text: 'Windows 10/11' },
      { icon: '✅', text: 'Требует GTA V' },
    ],
  },
  {
    n: '02', icon: '🎮', title: 'Установи и запусти',
    desc: 'Запусти скачанный установщик. После установки открой RAGE MP — он автоматически обновится до последней версии.',
    link: null,
    info: [
      { icon: '⚡', text: 'Быстрая установка' },
      { icon: '🔄', text: 'Автообновление' },
      { icon: '🛡️', text: 'Безопасно' },
    ],
  },
  {
    n: '03', icon: '🔍', title: 'Найди сервер Horizon RP',
    desc: 'В списке серверов найди Horizon RP или введи в строке подключения наш IP-адрес.',
    link: null,
    info: [
      { icon: '🌐', text: 'IP: play.horizonrp.ru' },
      { icon: '👥', text: 'До 1000 игроков' },
      { icon: '⚙️', text: 'Стабильный сервер' },
    ],
  },
  {
    n: '04', icon: '✍️', title: 'Зарегистрируйся',
    desc: 'При первом входе создай аккаунт, придумай имя персонажа и пройди небольшое вводное обучение.',
    link: null,
    info: [
      { icon: '🆓', text: 'Бесплатно' },
      { icon: '⏱️', text: '5 минут' },
      { icon: '🎭', text: 'Создай персонажа' },
    ],
  },
]

const Start: NextPage = () => (
  <>
    <Head><title>Как зайти — Horizon RP</title></Head>
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 relative"
        style={{ background: 'linear-gradient(135deg,#0a0a0f 0%,#0e0a18 100%)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <span className="text-sm font-semibold gradient-text">RAGE Multiplayer</span>
            </div>
            <h1 className="section-title mb-3">
              Как начать <span className="gradient-text">играть</span>
            </h1>
            <p className="text-lg" style={{ color: '#A9B0C2' }}>
              Horizon RP работает на платформе RAGE Multiplayer. Следуй шагам ниже.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* Шаги */}
        <div className="flex flex-col gap-6 mb-16">
          {STEPS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} className="glass-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Номер + иконка */}
                <div className="flex items-center gap-4 md:flex-col md:items-center md:w-20 flex-shrink-0">
                  <div className="font-manrope font-black text-4xl" style={{ color: '#7c3aed', opacity: 0.35 }}>{s.n}</div>
                  <div className="text-3xl">{s.icon}</div>
                </div>

                {/* Контент */}
                <div className="flex-1">
                  <h3 className="font-manrope font-bold text-xl mb-2">{s.title}</h3>
                  <p className="mb-5 leading-relaxed" style={{ color: '#A9B0C2' }}>{s.desc}</p>

                  {/* Инфо-теги */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {s.info.map((inf, j) => (
                      <span key={j} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl font-medium"
                        style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#c4b5fd' }}>
                        {inf.icon} {inf.text}
                      </span>
                    ))}
                  </div>

                  {/* Кнопка скачивания */}
                  {s.link && (
                    <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex text-sm px-6 py-3">
                      {s.link.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Карточки требований */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="font-manrope font-bold text-2xl text-center mb-8">
            Системные <span className="gradient-text">требования</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {[
              { icon: '💻', title: 'Операционная система', items: ['Windows 10 (64-bit)', 'Windows 11 (64-bit)', 'Минимум 8 ГБ RAM'] },
              { icon: '🎮', title: 'Игра',                 items: ['GTA V (лицензия)', 'Версия 1.0+', 'Steam / Rockstar / Epic'] },
              { icon: '🌐', title: 'Интернет',             items: ['Стабильное соединение', 'Минимум 10 Мбит/с', 'Низкий пинг'] },
            ].map((card, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-manrope font-bold text-lg mb-4">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="text-sm flex items-center justify-center gap-2" style={{ color: '#A9B0C2' }}>
                      <span style={{ color: '#7c3aed' }}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(167,139,250,0.05) 100%)' }}>
          <h2 className="font-manrope font-black text-3xl md:text-4xl mb-3">
            Готов? <span className="gradient-text">Начинаем!</span>
          </h2>
          <p className="mb-8 text-lg" style={{ color: '#A9B0C2' }}>
            Скачай RAGE MP и подключайся к Horizon RP прямо сейчас
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://rage.mp" target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-4">
              ⬇️ Скачать RAGE MP
            </a>
            <button className="btn-secondary text-base px-8 py-4">
              🎮 Начать играть
            </button>
          </div>
          <p className="mt-6 text-sm" style={{ color: '#A9B0C2' }}>
            Нужна помощь?{' '}
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer"
              className="font-semibold" style={{ color: '#7c3aed' }}>
              Зайди в наш Discord
            </a>
          </p>
        </motion.div>

      </main>
      <Footer />
    </div>
  </>
)

export default Start
