/* ============================================================
   Рендерер типизированных блоков панели направления.
   Новые виды контента добавляются новым kind + веткой здесь —
   структура готова к данным из реальных API.
   ============================================================ */
import { useMemo } from 'react'
import type { ChipStatus, PanelBlock } from '../../lib/types'
import { AGENCY_LOGOS, EcoIcon, IconArrow, isAgencyLogo } from '../../lib/icons'
import s from './InfoPanel.module.css'

const STATUS_LABEL: Record<ChipStatus, string> = {
  live: 'ишлайди',
  pilot: 'пилот',
  plan: 'режа',
  process: 'жараёнда',
}

interface Props {
  block: PanelBlock
  onAnchor: (anchor: string) => void
}

export function PanelBlockView({ block, onAnchor }: Props) {
  switch (block.kind) {
    case 'text':
      return <p className={s.bText}>{block.body}</p>

    case 'kpis':
      return (
        <div className={s.bKpis}>
          {block.items.map((k) => (
            <div key={k.label} className={s.bKpi}>
              <span className={`${s.bKpiValue} ${/^[\d\s.,%+-]+$/.test(k.value) ? s.bKpiNum : ''}`}>
                {k.value}
              </span>
              <span className={s.bKpiLabel}>{k.label}</span>
            </div>
          ))}
        </div>
      )

    case 'chips':
      return (
        <div className={s.bGroup}>
          <h4 className={s.bTitle}>{block.title}</h4>
          <div className={s.bChips}>
            {block.items.map((c) => (
              <span key={c.name} className={s.bChip}>
                {c.name}
                {c.status && <em className={`${s.bStatus} ${s[`st_${c.status}`]}`}>{STATUS_LABEL[c.status]}</em>}
              </span>
            ))}
          </div>
        </div>
      )

    case 'list':
      return (
        <div className={s.bGroup}>
          <h4 className={s.bTitle}>{block.title}</h4>
          <ul className={s.bList}>
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      )

    case 'bars':
      return <BarsBlock title={block.title} items={block.items} />

    case 'flow':
      return (
        <div className={s.bGroup}>
          <h4 className={s.bTitle}>{block.title}</h4>
          <div className={s.bFlow}>
            {block.steps.map((st, i) => (
              <div key={st.title} className={s.bFlowStep}>
                <span className={s.bFlowChip}>
                  {st.icon && (
                    <i className={s.bFlowIco}>
                      {isAgencyLogo(st.icon) ? (
                        <img className={s.bFlowLogo} src={AGENCY_LOGOS[st.icon]} alt="" />
                      ) : (
                        <EcoIcon id={st.icon} size={16} />
                      )}
                    </i>
                  )}
                  <span>
                    {st.title}
                    {st.sub && <small>{st.sub}</small>}
                  </span>
                </span>
                {i < block.steps.length - 1 && (
                  <span className={`${s.bFlowArrow} ${block.twoWay ? s.bFlowArrowTwo : ''}`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      )

    case 'graph':
      return <GraphBlock title={block.title} center={block.center} nodes={block.nodes} />

    case 'stack':
      return (
        <div className={s.bGroup}>
          <h4 className={s.bTitle}>{block.title}</h4>
          <div className={s.bStack}>
            {block.layers.map((l) => (
              <div key={l.title} className={s.bStackLayer}>
                <b>{l.title}</b>
                <span>{l.sub}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'link':
      return (
        <button className={s.bLink} onClick={() => onAnchor(block.anchor)}>
          {block.label}
          <IconArrow size={16} />
        </button>
      )
  }
}

function BarsBlock({ title, items }: { title: string; items: { label: string; value: number; display?: string }[] }) {
  const max = Math.max(...items.map((i) => i.value))
  return (
    <div className={s.bGroup}>
      <h4 className={s.bTitle}>{title}</h4>
      <div className={s.bBars}>
        {items.map((b) => (
          <div key={b.label} className={s.bBar}>
            <span className={s.bBarLabel}>{b.label}</span>
            <span className={s.bBarTrack}>
              <i style={{ width: `${Math.max(4, Math.round((b.value / max) * 100))}%` }} />
            </span>
            <span className={s.bBarValue}>{b.display ?? b.value.toLocaleString('ru-RU')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Мини-схема «звезда»: системы вокруг интеграционного центра. */
function GraphBlock({ title, center, nodes }: { title: string; center: string; nodes: string[] }) {
  const W = 520
  const H = 300
  const cx = W / 2
  const cy = H / 2
  const pts = useMemo(
    () =>
      nodes.map((label, i) => {
        const a = (-90 + (360 / nodes.length) * i) * (Math.PI / 180)
        return { label, x: cx + 190 * Math.cos(a), y: cy + 104 * Math.sin(a) }
      }),
    [nodes, cx, cy],
  )
  return (
    <div className={s.bGroup}>
      <h4 className={s.bTitle}>{title}</h4>
      <svg className={s.bGraph} viewBox={`0 0 ${W} ${H}`} aria-label={`${center}: ${nodes.join(', ')}`}>
        {pts.map((p) => (
          <line key={p.label} className={s.bGraphEdge} x1={p.x} y1={p.y} x2={cx} y2={cy} />
        ))}
        {pts.map((p) => (
          <g key={p.label} transform={`translate(${p.x}, ${p.y})`}>
            <rect className={s.bGraphNode} x={-56} y={-15} width={112} height={30} rx={15} />
            <text className={s.bGraphText} textAnchor="middle" dy="4">
              {p.label}
            </text>
          </g>
        ))}
        <g transform={`translate(${cx}, ${cy})`}>
          <rect className={s.bGraphCenter} x={-74} y={-24} width={148} height={48} rx={24} />
          <text className={s.bGraphCenterText} textAnchor="middle" dy="-2">
            {center.split(' ')[0]}
          </text>
          <text className={s.bGraphCenterSub} textAnchor="middle" dy="14">
            {center.split(' ').slice(1).join(' ')}
          </text>
        </g>
      </svg>
    </div>
  )
}
