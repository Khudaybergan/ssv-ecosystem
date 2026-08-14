import { useEffect, useState } from 'react'
import s from './TopBar.module.css'

/** Юқори панель: фақат герб ва вазирлик номи (навигациясиз). */
export function TopBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${s.bar} ${scrolled ? s.solid : ''}`}>
      <a className={s.brand} href="#ecosystem">
        <img className={s.emblem} src="/emblem.png" alt="Соғлиқни сақлаш вазирлиги герби" />
        <span className={s.brandText}>
          <span className={s.brandTop}>Ўзбекистон Республикаси</span>
          <span className={s.brandMain}>Соғлиқни сақлаш вазирлиги</span>
        </span>
      </a>
    </header>
  )
}
