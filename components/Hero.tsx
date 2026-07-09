import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Hero() {
  const [online, setOnline] = useState(1247)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { openAuth } = useAuth()

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    c.width = window.innerWidth; c.height = window.innerHeight
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 2 + .5, a: Math.random() * .4 + .1
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(109,93,251,${p.a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setOnline(v => v + Math.floor(Math.random() * 5) - 2), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#090B10' }}>
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(109,93,251,0.14) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(0,210,255,0.07) 0%, transparent 60%)',
      }} />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm" style={{ color: '#A9B0C2' }}>Онлайн:</span>
          <span className="text-sm font-bold text-green-400">{online.toLocaleString('ru-RU')}</span>
          <span className="text-sm" style={{ color: '#A9B0C2' }}>игроков</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="font-manrope font-black mb-6" style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', lineHeight: 1.1 }}>
          Живи своей <span className="gradient-text">историей</span>
          <br />в мире <span className="gradient-text">Horizon RP</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#A9B0C2' }}>
          Horizon RP: мир, где прошлое и будущее сплелись в Role Play! Погрузитесь в захватывающую атмосферу, вдохновлённую Horizon! Создайте своего персонажа — охотника, изобретателя, вождя или изгоя. Пропишите его историю, цели и мотивы.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button onClick={() => openAuth('register')} className="btn-primary text-base px-8 py-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Начать играть
          </button>
          <a href="https://rage.mp/ru" target="_blank" rel="noopener noreferrer" className="btn-secondary text-base px-8 py-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Скачать лаунчер
          </a>
        </motion.div>


      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #090B10, transparent)' }} />
    </section>
  )
}
