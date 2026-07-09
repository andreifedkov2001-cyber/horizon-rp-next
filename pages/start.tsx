import type { NextPage } from 'next'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

const STEPS = [
  { n: '01', icon: '🎮', title: 'Установи FiveM', desc: 'Скачай и установи лаунчер FiveM с официального сайта fivem.net' },
  { n: '02', icon: '🔍', title: 'Найди сервер',   desc: 'В поиске серверов введи «Horizon RP» или подключись по прямой ссылке' },
  { n: '03', icon: '✍️', title: 'Зарегистрируйся', desc: 'Создай персонажа, пройди обучение и начни свою историю' },
  { n: '04', icon: '🎭', title: 'Начни играть',   desc: 'Выбери профессию, вступи во фракцию и живи своей жизнью в городе' },
]

const Start: NextPage = () => (
  <>
    <Head><title>Как зайти — Horizon RP</title></Head>
    <div className="min-h-screen" style={{ background: '#090B10' }}>
      <Header />
      <section className="pt-24 pb-12 relative" style={{ background: 'linear-gradient(135deg,#090B10 0%,#12151D 100%)', borderBottom: '1px solid rgba(109,93,251,0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-3">Как начать <span className="gradient-text">играть</span></h1>
            <p style={{ color: '#A9B0C2' }}>Всего 4 простых шага до твоей истории</p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-6">
          {STEPS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-start gap-6">
              <div className="font-manrope font-black text-5xl flex-shrink-0" style={{ color: '#6D5DFB', opacity: 0.4 }}>{s.n}</div>
              <div className="flex-1">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-manrope font-bold text-xl mb-2">{s.title}</h3>
                <p style={{ color: '#A9B0C2' }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="btn-primary text-base px-10 py-4">▶ Начать играть прямо сейчас</button>
        </div>
      </main>
      <Footer />
    </div>
  </>
)

export default Start
