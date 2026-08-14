/* ============================================================
   Операцион марказ — миллий тизимнинг бошқарув маркази:
   мини-графикли KPI, телеметрия оқими, интеграциялар динамикаси,
   ҳудудий статистика.
   ============================================================ */
import { useEffect, useMemo, useState } from 'react'
import { OPS_KPIS, TELEMETRY, INTEGRATION_TIMELINE, NATIONAL } from '../../data/stats'
import { REGIONS } from '../../data/regions'
import { fmt, useClock, useReveal, usePrefersReducedMotion } from '../../lib/hooks'
import { SectionHead } from './SectionHead'
import s from './OpsCenter.module.css'

export function OpsCenter() {
  const ref = useReveal<HTMLDivElement>(0.08)
  return (
    <section id="ops" className={`section ${s.ops}`}>
      <div className="container">
        <div className={s.headRow}>
          <SectionHead
            light
            icon="ops"
            eyebrow="Операцион марказ"
            title="Соғлиқни сақлаш тизими — ягона экранда"
            lead="Соҳа рақамли тизимларининг реал вақтга яқин телеметрияси: ташкилотлар тармоғи, мурожаатлар оқими, интеграциялар ва ҳудудий кўрсаткичлар."
          />
          <StatusPlate />
        </div>

        <div ref={ref} className={s.grid}>
          <div className={s.kpis}>
            {OPS_KPIS.map((k) => (
              <div key={k.id} className={s.kpi}>
                <span className={s.kpiLabel}>{k.label}</span>
                <span className={s.kpiValue}>{k.display ?? fmt(k.value)}</span>
                <Spark points={k.spark} />
                <span className={s.kpiDelta}>{k.deltaLabel}</span>
              </div>
            ))}
          </div>

          <div className={s.side}>
            <Telemetry />
            <Timeline />
          </div>
        </div>

        <RegionStrip />
        <p className={s.note}>Намойиш маълумотлари · интеграция агрегатлари — идоралараро алмашинув реестри, 2026 йил март</p>
      </div>
    </section>
  )
}

function StatusPlate() {
  const time = useClock()
  return (
    <div className={s.status}>
      <span className={s.statusDot} />
      <span className={s.statusText}>
        Барча тизимлар меъёрида
        <small>
          {NATIONAL.regionsOnline}/{NATIONAL.regionsTotal} ҳудуд · кечикиш &lt; 90 мс
        </small>
      </span>
      <span className={s.clock}>{time}</span>
    </div>
  )
}

/** Мини-график тренда внутри KPI-карточки. */
function Spark({ points }: { points: number[] }) {
  const path = useMemo(() => {
    const W = 120
    const H = 34
    const step = W / (points.length - 1)
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(H - (p / 100) * H + 2).toFixed(1)}`).join(' ')
    return { line, area: `${line} L${W},${H + 4} L0,${H + 4} Z` }
  }, [points])
  return (
    <svg className={s.spark} viewBox="0 0 120 38" preserveAspectRatio="none" aria-hidden="true">
      <path className={s.sparkArea} d={path.area} />
      <path className={s.sparkLine} d={path.line} />
    </svg>
  )
}

/** Лента событий: циклическая демо-телеметрия. */
function Telemetry() {
  const reduced = usePrefersReducedMotion()
  const [feed, setFeed] = useState(() => TELEMETRY.slice(0, 5))
  const [cursor, setCursor] = useState(5)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => {
      setFeed((f) => [TELEMETRY[cursor % TELEMETRY.length], ...f].slice(0, 5))
      setCursor((c) => c + 1)
    }, 3000)
    return () => clearInterval(t)
  }, [reduced, paused, cursor])

  return (
    <div
      className={s.feed}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Экотизим воқеалар оқими"
    >
      <div className={s.blockTitle}>
        Воқеалар оқими <span className={s.liveBadge}>live</span>
      </div>
      <ul className={s.feedList}>
        {feed.map((e, i) => (
          <li key={`${e.message}-${i}`} className={i === 0 ? s.feedNew : ''}>
            <span className={s.feedSys}>{e.system}</span>
            <span className={s.feedMsg}>
              {e.message}
              {e.region && <em> · {e.region}</em>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Динамика: новые интеграции по годам (реальные агрегаты реестра). */
function Timeline() {
  const max = Math.max(...INTEGRATION_TIMELINE.map((t) => t.count))
  return (
    <div className={s.timeline}>
      <div className={s.blockTitle}>Давлат тизимлари билан интеграциялар, йиллар бўйича</div>
      <div className={s.tlRow}>
        {INTEGRATION_TIMELINE.map((t) => (
          <div key={t.year} className={s.tlCol}>
            <span className={s.tlCount}>{t.count}</span>
            <span className={s.tlBar} style={{ height: `${Math.max(8, (t.count / max) * 100)}%` }} />
            <span className={s.tlYear}>{String(t.year).slice(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Территориальная статистика: подключение регионов к платформе. */
function RegionStrip() {
  const sorted = useMemo(() => [...REGIONS].sort((a, b) => b.coverage - a.coverage), [])
  return (
    <div className={s.regions}>
      <div className={s.blockTitle}>Ҳудудлар бўйича ягона платформага уланиш, %</div>
      <div className={s.regionRow}>
        {sorted.map((r) => (
          <div key={r.id} className={s.region} title={`${r.name}: ${r.coverage} %`}>
            <span className={s.regionBarTrack}>
              <i style={{ height: `${r.coverage}%` }} />
            </span>
            <span className={s.regionVal}>{r.coverage}</span>
            <span className={s.regionName}>{r.short}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
