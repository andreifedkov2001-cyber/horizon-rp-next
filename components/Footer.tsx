import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(124,58,237,0.1)', background: '#0a0a0f' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>H</div>
              <span className="font-manrope font-black text-xl">HORIZON<span className="gradient-text">RP</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#A9B0C2' }}>GTA V RolePlay сервер нового поколения. Живи своей историей.</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { href: 'https://discord.gg/K2aE6q9NN', title: 'Discord', svg: <svg viewBox="0 -28.5 256 256" fill="currentColor" className="w-4 h-4"><path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.081-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"/></svg> },
                { href: '#', title: 'Telegram', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                { href: 'https://vk.com/horizonrpgta5', title: 'ВКонтакте', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-.708-1.49.315v1.399c0 .376-.12.6-1.1.6-1.621 0-3.42-.982-4.685-2.815C6.736 12.21 6.032 9.81 6.032 9.81s-.072-.18.014-.27c.1-.09.36-.09.36-.09h1.744c.26 0 .344.15.44.43.48 1.395 1.284 2.618 1.614 2.618.123 0 .18-.058.18-.374V9.63c-.036-.67-.39-.727-.39-.727s-.115-.138.076-.313c.162-.148.434-.163.434-.163h2.744c.225 0 .3.12.3.378v3.055c0 .225.1.3.163.3.123 0 .226-.075.453-.3 1.4-1.566 2.393-3.978 2.393-3.978s.084-.18.24-.24c.16-.06.38-.06.38-.06h1.744c.525 0 .635.27.525.54-.87 2.025-2.803 4.575-2.803 4.575s-.15.24 0 .48c.107.163.457.497.69.75.84.9 1.49 1.663 1.66 2.188.172.524-.09.793-.616.793z"/></svg> },
                { href: '#', title: 'YouTube', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { href: 'https://www.tiktok.com/@horizonrpgta5?_r=1&_t=ZG-97atYyr3XrF', title: 'TikTok', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg> },
                { href: 'https://www.instagram.com/horizonrpgta5?igsh=eTFmajIza3I1YTNn&utm_source=qr', title: 'Instagram', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
              ].map(s => (
                <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A9B0C2' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#A9B0C2'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Навигация', links: [{ l: 'Главная', h: '/' }, { l: 'Как зайти', h: '/start' }, { l: 'Новости', h: '/news' }, { l: 'Форум', h: '/forum' }, { l: 'Донат', h: '/donate' }] },
            { title: 'Поддержка', links: [{ l: 'Правила', h: '#' }, { l: 'FAQ', h: '#' }, { l: 'Техподдержка', h: '#' }, { l: 'Баг-репорт', h: '#' }] },
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
