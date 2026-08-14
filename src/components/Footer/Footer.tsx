import s from './Footer.module.css'

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.brand}>
          <img className={s.emblem} src="/emblem.png" alt="" />
          <div>
            <b>Соғлиқни сақлаш вазирлиги</b>
            <span>Ўзбекистон Республикаси</span>
          </div>
        </div>

        <p className={s.note}>
          Соғлиқни сақлашнинг ягона рақамли экотизими намойиш портали. Кўрсаткичлар — намойиш учун; интеграция
          агрегатлари идоралараро алмашинув реестрига мос (2026 йил март). Архитектура DMED, давлат ахборот
          тизимлари, таҳлилий панеллар ва СИ-модулларини улашга тайёр.
        </p>

        <div className={s.meta}>
          <span>© 2026 Ўзбекистон Республикаси Соғлиқни сақлаш вазирлиги</span>
          <span className={s.credit}>Ҳудудлар харитаси — Simplemaps.com (free license)</span>
        </div>
      </div>
    </footer>
  )
}
