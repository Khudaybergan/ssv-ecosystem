import { useEffect, useState } from 'react'
import { IconClose, IconMenu } from '../../lib/icons'
import s from './TopBar.module.css'

const NAV = [
  { href: '#ecosystem', label: 'Экотизим' },
  { href: '#ops', label: 'Операцион марказ' },
  { href: '#data', label: 'Маълумотлар' },
  { href: '#ai', label: 'СИ' },
  { href: '#geo', label: 'Харита' },
  { href: '#architecture', label: 'Архитектура' },
]

export function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`${s.bar} ${scrolled || open ? s.solid : ''}`}>
      <a className={s.brand} href="#ecosystem" onClick={() => setOpen(false)}>
        <img className={s.emblem} src="/emblem.png" alt="Соғлиқни сақлаш вазирлиги герби" />
        <span className={s.brandText}>
          <span className={s.brandTop}>Ўзбекистон Республикаси</span>
          <span className={s.brandMain}>Соғлиқни сақлаш вазирлиги</span>
        </span>
      </a>

      <nav className={s.nav} aria-label="Бўлимлар">
        {NAV.map((n) => (
          <a key={n.href} className={s.navLink} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>

      <button
        className={s.burger}
        aria-expanded={open}
        aria-label={open ? 'Менюни ёпиш' : 'Менюни очиш'}
        onClick={() => setOpen(!open)}
      >
        {open ? <IconClose size={22} /> : <IconMenu size={22} />}
      </button>

      {open && (
        <nav className={s.sheet} aria-label="Бўлимлар">
          {NAV.map((n) => (
            <a key={n.href} className={s.sheetLink} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
