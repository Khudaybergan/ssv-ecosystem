/* ============================================================
   Мобил кўриниш: ўша drill-down дарахти — стек навигация
   (телефон созламалари каби) — ичига ва орқага.
   ============================================================ */
import { useState } from 'react'
import type { EcoNode } from '../../lib/types'
import { AGENCY_LOGOS, EcoIcon, IconArrow, isAgencyLogo } from '../../lib/icons'
import s from './Hero.module.css'

interface Props {
  root: EcoNode
  onOpenNode: (node: EcoNode, path: EcoNode[]) => void
}

export function MobileEcosystem({ root, onOpenNode }: Props) {
  const [path, setPath] = useState<EcoNode[]>([root])
  const focus = path[path.length - 1]
  const depth = path.length - 1
  const kids = focus.children ?? []

  const enter = (n: EcoNode) => {
    if (n.children?.length) setPath((p) => [...p, n])
    else onOpenNode(n, [...path, n])
  }

  return (
    <div className={s.mob} key={focus.id}>
      {depth === 0 ? (
        <button className={s.mobCore} onClick={() => onOpenNode(root, [root])}>
          <img className={s.mobEmblem} src="/emblem.png" alt="" />
          <span>
            <span className={s.mobCoreTitle}>{root.name}</span>
            {root.coreMeta && <span className={s.mobCoreSub}>{root.coreMeta.toLowerCase()}</span>}
          </span>
        </button>
      ) : (
        <div className={s.mobHead}>
          <button
            className={s.mobBack}
            onClick={() => setPath((p) => p.slice(0, -1))}
            aria-label="Юқори даражага"
          >
            ←
          </button>
          <button className={s.mobFocus} onClick={() => onOpenNode(focus, path)}>
            <span className={s.mobFocusName}>{focus.name}</span>
            <span className={s.mobFocusDesc}>{focus.desc}</span>
          </button>
        </div>
      )}

      <div className={s.mobGroup}>{focus.childrenLabel ?? (depth === 0 ? 'Ҳамкор идоралар' : 'Алмашинув йўналишлари')}</div>
      {kids.map((n) => (
        <button key={n.id} className={s.mobRow} onClick={() => enter(n)}>
          <span className={s.mobIcon}>
            {n.icon ? (
              isAgencyLogo(n.icon) ? <img className={s.mobLogo} src={AGENCY_LOGOS[n.icon]} alt="" /> : <EcoIcon id={n.icon} size={21} />
            ) : n.mark ? (
              <span className={s.mobMark}>{n.mark}</span>
            ) : (
              <span className={s.mobDot} aria-hidden="true" />
            )}
          </span>
          <span className={s.mobBody}>
            <span className={s.mobName}>
              {n.name}
              {n.status === 'plan' && !n.children?.length && <em className={s.mobPlan}>режада · 2026</em>}
            </span>
            <span className={s.mobTag}>{n.desc}</span>
          </span>
          {n.children?.length ? (
            <span className={s.mobCount}>{n.children.length}</span>
          ) : (
            <IconArrow size={17} className={s.mobArrow} />
          )}
        </button>
      ))}
    </div>
  )
}
