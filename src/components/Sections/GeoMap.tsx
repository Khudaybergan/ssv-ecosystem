/* ============================================================
   ГАТ: Ўзбекистоннинг интерактив харитаси.
   Танланган кўрсаткич бўйича хороплет, hover-ажратиш,
   таҳлилий карточка ва ўнгда рейтинг.
   ============================================================ */
import { useMemo, useState } from 'react'
import { MAP_VIEWBOX, REGIONS } from '../../data/regions'
import type { Region, RegionMetric } from '../../lib/types'
import { fmt, useReveal } from '../../lib/hooks'
import { SectionHead } from './SectionHead'
import s from './GeoMap.module.css'

const METRICS: { id: RegionMetric; label: string; unit: string; format: (r: Region) => string }[] = [
  { id: 'orgs', label: 'Ташкилотлар', unit: 'тиббий ташкилот', format: (r) => fmt(r.orgs) },
  { id: 'coverage', label: 'Платформа қамрови', unit: '% уланиш', format: (r) => `${r.coverage} %` },
  { id: 'docsPer10k', label: 'Шифокорлар', unit: '10 минг аҳолига шифокор', format: (r) => String(r.docsPer10k).replace('.', ',') },
]

export function GeoMap() {
  const ref = useReveal<HTMLDivElement>(0.08)
  const [metric, setMetric] = useState<RegionMetric>('orgs')
  const [selected, setSelected] = useState<Region>(REGIONS.find((r) => r.id === 'UZTK') ?? REGIONS[0])
  const [hovered, setHovered] = useState<Region | null>(null)

  const active = hovered ?? selected
  const m = METRICS.find((x) => x.id === metric)!

  const { min, max } = useMemo(() => {
    const vals = REGIONS.map((r) => r[metric])
    return { min: Math.min(...vals), max: Math.max(...vals) }
  }, [metric])

  const intensity = (r: Region) => (max === min ? 0.6 : 0.14 + ((r[metric] - min) / (max - min)) * 0.72)

  const top = useMemo(() => [...REGIONS].sort((a, b) => b[metric] - a[metric]).slice(0, 5), [metric])

  return (
    <section id="geo" className={`section ${s.geo}`}>
      <div className="container">
        <SectionHead
          icon="gis"
          eyebrow="Геоахборот тизими"
          title="Тиббий инфратузилма — мамлакат харитасида"
          lead="Ҳар бир ҳудуд — ўз тармоқ ва рақамли қамров кўрсаткичлари билан. Таҳлилий карточкани кўриш учун курсорни вилоят устига олиб боринг."
        />

        <div className={s.controls} role="tablist" aria-label="Харита кўрсаткичи">
          {METRICS.map((mt) => (
            <button
              key={mt.id}
              role="tab"
              aria-selected={metric === mt.id}
              className={`${s.metricBtn} ${metric === mt.id ? s.metricOn : ''}`}
              onClick={() => setMetric(mt.id)}
            >
              {mt.label}
            </button>
          ))}
        </div>

        <div ref={ref} className={s.layout}>
          <div className={s.mapBox}>
            <svg className={s.map} viewBox={MAP_VIEWBOX} role="group" aria-label="Ўзбекистон ҳудудлари харитаси">
              {REGIONS.map((r) => (
                <path
                  key={r.id}
                  d={r.path}
                  className={`${s.region} ${active.id === r.id ? s.regionOn : ''}`}
                  style={{ fillOpacity: intensity(r) }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${r.name}: ${m.format(r)} ${m.unit}`}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(r)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected(r)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelected(r)
                    }
                  }}
                />
              ))}
            </svg>
            <div className={s.legend} aria-hidden="true">
              <span>{fmtLegend(min, metric)}</span>
              <span className={s.legendBar} />
              <span>{fmtLegend(max, metric)}</span>
            </div>
          </div>

          <aside className={s.rail}>
            <div className={s.card} key={active.id + metric}>
              <span className={s.cardEyebrow}>{active.capital}</span>
              <h3 className={s.cardTitle}>{active.name}</h3>
              <div className={s.cardMain}>
                <span className={s.cardValue}>{m.format(active)}</span>
                <span className={s.cardUnit}>{m.unit}</span>
              </div>
              <dl className={s.cardStats}>
                <div>
                  <dt>Тиббий ташкилотлар</dt>
                  <dd>{fmt(active.orgs)}</dd>
                </div>
                <div>
                  <dt>Платформа қамрови</dt>
                  <dd>{active.coverage} %</dd>
                </div>
                <div>
                  <dt>10 минг аҳолига шифокор</dt>
                  <dd>{String(active.docsPer10k).replace('.', ',')}</dd>
                </div>
                <div>
                  <dt>Рақамли хизматлар</dt>
                  <dd>{active.services}</dd>
                </div>
              </dl>
            </div>

            <div className={s.top}>
              <span className={s.topTitle}>Топ-5 · {m.label.toLowerCase()}</span>
              {top.map((r, i) => (
                <button
                  key={r.id}
                  className={`${s.topRow} ${active.id === r.id ? s.topOn : ''}`}
                  onClick={() => setSelected(r)}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className={s.topNum}>{i + 1}</span>
                  <span className={s.topName}>{r.short}</span>
                  <span className={s.topVal}>{m.format(r)}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function fmtLegend(v: number, metric: RegionMetric): string {
  if (metric === 'coverage') return `${v} %`
  if (metric === 'docsPer10k') return String(v).replace('.', ',')
  return fmt(v)
}
