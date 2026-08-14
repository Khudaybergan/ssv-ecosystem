/* ============================================================
   Экотизим архитектураси: фуқародан давлат бошқарувигача олти
   даража. Чапда умумий шина, hover даражани ажратади, чиплар
   боғлиқ йўналишларни очади.
   ============================================================ */
import { useState } from 'react'
import { ARCH_LEVELS } from '../../data/stats'
import type { DirectionId } from '../../lib/types'
import { useReveal } from '../../lib/hooks'
import { SectionHead } from './SectionHead'
import s from './Architecture.module.css'

interface Props {
  onOpen: (id: DirectionId) => void
}

export function Architecture({ onOpen }: Props) {
  const ref = useReveal<HTMLDivElement>(0.06)
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="architecture" className={`section ${s.arch}`}>
      <div className="container">
        <SectionHead
          icon="platform"
          eyebrow="Экотизим архитектураси"
          title="Бир бутуннинг олти даражаси"
          lead="Фуқародан давлат бошқарувигача — ҳар бир даража олдингисига таянади, маълумотлар эса бутун вертикал бўйлаб ҳаракатланади. Йўналишини очиш учун компонентни босинг."
        />

        <div ref={ref} className={s.stack} onMouseLeave={() => setActive(null)}>
          <span className={s.spine} aria-hidden="true">
            <i className={s.spinePulse} />
          </span>

          {ARCH_LEVELS.map((lvl) => (
            <div
              key={lvl.n}
              className={`${s.level} ${active !== null && active !== lvl.n ? s.levelDim : ''} ${active === lvl.n ? s.levelHot : ''} ${lvl.n === 4 ? s.levelCore : ''}`}
              onMouseEnter={() => setActive(lvl.n)}
            >
              <span className={s.port} aria-hidden="true" />
              <div className={s.levelHead}>
                <span className={s.levelNum}>Д-{lvl.n}</span>
                <div>
                  <h3 className={s.levelTitle}>{lvl.title}</h3>
                  <p className={s.levelSub}>{lvl.sub}</p>
                </div>
              </div>
              <div className={s.chips}>
                {lvl.chips.map((c) =>
                  c.direction ? (
                    <button key={c.label} className={`${s.chip} ${s.chipLink}`} onClick={() => onOpen(c.direction!)}>
                      {c.label}
                    </button>
                  ) : (
                    <span key={c.label} className={s.chip}>
                      {c.label}
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
