import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const { authOpen, authTab, closeAuth, login, register, loading } = useAuth()
  const [tab, setTab]     = useState<'login'|'register'>(authTab)
  const [nick, setNick]   = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [pass2, setPass2] = useState('')
  const [err, setErr]     = useState('')

  useEffect(() => { setTab(authTab) }, [authTab])

  const reset = () => { setNick(''); setEmail(''); setPass(''); setPass2(''); setErr('') }

  const doLogin = async () => {
    setErr('')
    if (!nick) return setErr('Введи никнейм')
    if (!pass) return setErr('Введи пароль')
    
    const e = await login(nick, pass)
    if (e) setErr(e); else reset()
  }

  const doReg = async () => {
    setErr('')
    if (!nick) return setErr('Введи никнейм')
    if (!email) return setErr('Введи email')
    if (!pass) return setErr('Введи пароль')
    if (pass !== pass2) return setErr('Пароли не совпадают')
    
    const e = await register(nick, email, pass)
    if (e) setErr(e); else reset()
  }

  const submit = tab === 'login' ? doLogin : doReg

  return (
    <AnimatePresence>
      {authOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeAuth}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-8 relative"
            style={{ background: 'rgba(18,21,29,0.98)', border: '1px solid rgba(124,58,237,0.2)' }}>

            <button onClick={closeAuth}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>✕</button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center font-black text-xl text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>H</div>
              <div className="font-manrope font-black text-2xl">HORIZON<span className="gradient-text">RP</span></div>
            </div>

            <div className="flex gap-1 rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {(['login','register'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setErr('') }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={tab === t ? { background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff' } : { color: '#A9B0C2' }}>
                  {t === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {[
                { show: true, label: 'Никнейм', val: nick, set: setNick, type: 'text', ph: 'Твой никнейм' },
                { show: tab === 'register', label: 'Email', val: email, set: setEmail, type: 'email', ph: 'example@mail.com' },
                { show: true, label: 'Пароль', val: pass, set: setPass, type: 'password', ph: 'Минимум 6 символов' },
                { show: tab === 'register', label: 'Повтори пароль', val: pass2, set: setPass2, type: 'password', ph: 'Повтори пароль' },
              ].filter(f => f.show).map((f, i) => (
                <div key={i}>
                  <label className="text-xs mb-1.5 block font-medium" style={{ color: '#A9B0C2' }}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                    placeholder={f.ph} onKeyDown={e => e.key === 'Enter' && submit()}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                </div>
              ))}

              {err && <div className="text-red-400 text-sm rounded-xl px-4 py-2.5"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>{err}</div>}

              <button onClick={submit} disabled={loading} className="btn-primary w-full justify-center mt-1 disabled:opacity-50">
                {loading
                  ? <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : tab === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>

              <p className="text-center text-xs" style={{ color: '#A9B0C2' }}>
                {tab === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErr('') }}
                  className="font-semibold" style={{ color: '#7c3aed' }}>
                  {tab === 'login' ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
