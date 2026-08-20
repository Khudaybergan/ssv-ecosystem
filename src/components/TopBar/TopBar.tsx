import s from './TopBar.module.css'

/**
 * Ҳужжат сарлавҳаси: чапда — герб ва вазирлик номи, ўнгда — харита
 * асосланган реестрнинг расмий манбаси. Пастда икки қатор ҳошия
 * (латун + сиёҳ) — расмий бланк чизиғи.
 */
export function TopBar() {
  return (
    <header className={s.bar}>
      <a className={s.brand} href="#ecosystem">
        <img className={s.emblem} src="/emblem.png" alt="Соғлиқни сақлаш вазирлиги герби" />
        <span className={s.brandText}>
          <span className={s.brandTop}>Ўзбекистон Республикаси</span>
          <span className={s.brandMain}>Соғлиқни сақлаш вазирлиги</span>
        </span>
      </a>
      <dl className={s.meta}>
        <dt className={s.metaKey}>Ҳужжат</dt>
        <dd className={s.metaVal}>«Интеграция қилинадиган АТлар» реестри</dd>
        <dt className={s.metaKey}>Ҳолат санаси</dt>
        <dd className={s.metaVal}>30.03.2026</dd>
      </dl>
    </header>
  )
}
