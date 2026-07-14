import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const Profile: NextPage = () => {
  const { user, logout, openAuth } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = setTimeout(() => {
      if (!localStorage.getItem('hrp_session')) { 
        openAuth('login')
        // Не делаем router.push здесь, так как это может вызвать проблемы при экспорте
      }
    }, 400)
    return () => clearTimeout(t)
  }, [user, openAuth])

  // Загружаем аватар пользователя
  useEffect(() => {
    if (!user) return
    try {
      const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
      const u = users.find((x: any) => x.id === user.id)
      if (u?.avatar) setAvatar(u.avatar)
    } catch {}
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 2 * 1024 * 1024) { alert('Файл слишком большой. Максимум 2MB.'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      // Сохраняем в users
      const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
      const idx = users.findIndex((x: any) => x.id === user.id)
      if (idx !== -1) {
        users[idx].avatar = base64
        localStorage.setItem('hrp_users', JSON.stringify(users))
      }
      // Обновляем сессию
      const session = JSON.parse(localStorage.getItem('hrp_session') || 'null')
      if (session) {
        session.avatar = base64
        localStorage.setItem('hrp_session', JSON.stringify(session))
      }
      setAvatar(base64)
      setUploading(false)
      // Уведомляем Header об обновлении аватара
      window.dispatchEvent(new Event('avatarUpdate'))
    }
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    if (!user) return
    const users = JSON.parse(localStorage.getItem('hrp_users') || '[]')
    const idx = users.findIndex((x: any) => x.id === user.id)
    if (idx !== -1) { delete users[idx].avatar; localStorage.setItem('hrp_users', JSON.stringify(users)) }
    const session = JSON.parse(localStorage.getItem('hrp_session') || 'null')
    if (session) { delete session.avatar; localStorage.setItem('hrp_session', JSON.stringify(session)) }
    setAvatar(null)
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-sm" style={{ color: '#A9B0C2' }}>Загрузка...</div>
    </div>
  )

  const roleMap: Record<string,string> = { Admin:'👑 Администратор', Moder:'🛡 Модератор', Player:'🎮 Игрок' }

  return (
    <>
      <Head><title>Профиль — Horizon RP</title></Head>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Header />

        {/* Баннер */}
        <div className="pt-16 relative h-48 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3) 0%,rgba(167,139,250,0.15) 100%)' }}>
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        {/* Аватар + инфо */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-8">

            {/* Аватар с кнопкой загрузки */}
            <div className="relative flex-shrink-0 group">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center font-black text-4xl text-white"
                style={{ border: '4px solid #0a0a0f', background: avatar ? 'transparent' : 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : user.nick[0].toUpperCase()
                }
              </motion.div>

              {/* Оверлей при наведении */}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.65)', border: '4px solid #0a0a0f' }}
                title="Сменить аватарку">
                {uploading
                  ? <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      <span className="text-white text-xs font-semibold">Загрузить</span>
                    </>
                }
              </button>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1">
              <h1 className="font-manrope font-black text-3xl">{user.nick}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                  {roleMap[user.role] || '🎮 Игрок'}
                </span>
                <span className="text-sm" style={{ color: '#A9B0C2' }}>Зарегистрирован: {user.joined}</span>
              </div>
              {/* Кнопки управления аватаром */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button onClick={() => fileRef.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                  📷 {avatar ? 'Сменить фото' : 'Загрузить фото'}
                </button>
                {avatar && (
                  <button onClick={removeAvatar}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                    🗑 Удалить фото
                  </button>
                )}
              </div>
            </div>

            <button onClick={() => { logout(); router.push('/') }}
              className="btn-secondary text-sm py-2 px-5 flex-shrink-0"
              style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
              🚪 Выйти
            </button>
          </div>

          {/* Статы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[['⏱️','0','Часов в игре'],['👤','0','Персонажей'],['💰','0','HorizonCoin'],['💎','Нет','Донат статус']].map(([ic,v,l],i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card p-5 text-center">
                <div className="text-3xl mb-2">{ic}</div>
                <div className="font-manrope font-black text-2xl gradient-text">{v}</div>
                <div className="text-xs mt-1" style={{ color: '#A9B0C2' }}>{l}</div>
              </motion.div>
            ))}
          </div>

          {/* Блоки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-6">
              <h2 className="font-manrope font-bold text-lg mb-5">📋 Информация</h2>
              <div className="space-y-4">
                {[['Никнейм', user.nick],['Email', user.email],['Роль', roleMap[user.role]||'Игрок'],['Регистрация', user.joined]].map(([l,v],i) => (
                  <div key={i}>
                    <div className="text-xs font-medium mb-1" style={{ color: '#A9B0C2' }}>{l}</div>
                    <div className="text-sm font-medium break-all">{v}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="md:col-span-2 glass-card p-6">
              <h2 className="font-manrope font-bold text-lg mb-5">🎭 Мои персонажи</h2>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-5xl mb-4 opacity-40">👤</div>
                <p className="text-sm mb-5" style={{ color: '#A9B0C2' }}>У тебя пока нет персонажей.<br/>Зайди на сервер чтобы создать первого!</p>
                <button className="btn-primary text-sm px-6 py-2.5">Начать играть</button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="md:col-span-3 glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-manrope font-bold text-lg">💎 Донат статус</h2>
                <Link href="/donate" className="btn-primary text-sm px-5 py-2">Купить статус</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[['⭐','Стартер'],['💎','Премиум'],['👑','Элита']].map(([ic,nm],i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl opacity-40"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-2xl">{ic}</div>
                    <div>
                      <div className="font-semibold text-sm">{nm}</div>
                      <div className="text-xs" style={{ color: '#A9B0C2' }}>Не активен</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Profile
