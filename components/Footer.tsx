import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(109,93,251,0.1)', background: '#090B10' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Готов начать своё <span className="gradient-text">приключение?</span></h2>
          <p className="mb-6" style={{ color: '#A9B0C2' }}>Регистрация бесплатная. Тысячи игроков ждут тебя.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary px-8 py-3.5">▶ Начать играть</button>
            <button className="btn-secondary px-8 py-3.5">↓ Скачать лаунчер</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#6D5DFB,#00D2FF)' }}>H</div>
              <span className="font-manrope font-black text-xl">HORIZON<span className="gradient-text">RP</span></span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#A9B0C2' }}>GTA V RolePlay сервер нового поколения. Живи своей историей.</p>
          </div>
          {[
            { title: 'Навигация', links: [{ l: 'Главная', h: '/' }, { l: 'Как зайти', h: '/start' }, { l: 'Новости', h: '/news' }, { l: 'Форум', h: '/forum' }, { l: 'Донат', h: '/donate' }] },
            { title: 'Поддержка', links: [{ l: 'Правила', h: '#' }, { l: 'FAQ', h: '#' }, { l: 'Техподдержка', h: '#' }, { l: 'Баг-репорт', h: '#' }] },
            { title: 'Сообщество', links: [{ l: 'Discord', h: 'https://discord.gg' }, { l: 'Telegram', h: '#' }, { l: 'ВКонтакте', h: '#' }, { l: 'YouTube', h: '#' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#A9B0C2' }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(lk => (
                  <li key={lk.l}><Link href={lk.h} className="text-sm transition-colors" style={{ color: '#A9B0C2' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A9B0C2')}>{lk.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: '#A9B0C2' }}>© 2024 Horizon RP. Все права защищены.</p>
          <p className="text-xs" style={{ color: '#A9B0C2' }}>Не является официальным продуктом Rockstar Games</p>
        </div>
      </div>
    </footer>
  )
}
