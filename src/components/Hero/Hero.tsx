import { useState } from 'react'
import type { EcoNode } from '../../lib/types'
import { ECOSYSTEM_ROOT } from '../../data/tree'
import { ERECEPT_ROOT } from '../../data/erecept'
import { REGISTRY_TOTALS } from '../../data/registry'
import { useMedia, usePrefersReducedMotion } from '../../lib/hooks'
import { EcosystemMap } from './EcosystemMap'
import { MobileEcosystem } from './MobileEcosystem'
import heroBg from '../../../Ministry_of_Health_(Tashkent).jpg'
import s from './Hero.module.css'

interface Props {
  onOpenNode: (node: EcoNode, path: EcoNode[]) => void
  panelOpen: boolean
}

const T = REGISTRY_TOTALS

/** Харита режимлари: идоралараро интеграция ёки «Электрон рецепт» */
const MODES = [
  {
    id: 'gov',
    label: 'Идоралараро интеграция',
    root: ECOSYSTEM_ROOT,
    caption: 'Идоралараро маълумот алмашинуви харитаси',
    facts: [
      { v: String(T.total), k: 'алмашинув йўналиши' },
      { v: String(T.agencies), k: 'ҳамкор идора' },
      { v: String(T.active), k: 'жорий этилган' },
      { v: String(T.process), k: 'режада' },
    ],
  },
  {
    id: 'erx',
    label: 'Электрон рецепт',
    root: ERECEPT_ROOT,
    caption: 'Электрон рецепт тизимлари билан интеграция харитаси',
    facts: [
      { v: String(ERECEPT_ROOT.children?.length ?? 0), k: 'дорихона тизими' },
      { v: 'Жорий этилган', k: 'алмашинув ҳолати' },
    ],
  },
] as const

export function Hero({ onOpenNode, panelOpen }: Props) {
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('gov')
  const active = MODES.find((m) => m.id === mode)!
  const compact = useMedia('(max-width: 940px)')
  const reduced = usePrefersReducedMotion()

  return (
    <section id="ecosystem" className={s.hero}>
      <div className={s.bg} aria-hidden="true">
        <img className={s.bgImg} src={heroBg} alt="" />
        <div className={s.bgHaze} />
      </div>

      <div className={s.inner}>
        <div className={s.mapHead}>
          <h1 className={s.mapTitle}>Соғлиқни сақлаш вазирлиги</h1>
          <p className={s.mapCaption}>{active.caption}</p>
          <div className={s.modeSwitch} role="tablist" aria-label="Харита режими">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                className={`${s.modeBtn} ${mode === m.id ? s.modeOn : ''}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className={s.mapLayer}>
          {compact ? (
            <MobileEcosystem key={mode} root={active.root} onOpenNode={onOpenNode} />
          ) : (
            <EcosystemMap
              key={mode}
              root={active.root}
              onOpenNode={onOpenNode}
              panelOpen={panelOpen}
              reduced={reduced}
            />
          )}
        </div>

        {/* ҳужжат таги: кўрсаткичлар ва манба */}
        <footer className={s.sheetFoot}>
          <dl className={s.facts}>
            {active.facts.map((f) => (
              <div key={f.k} className={s.fact}>
                <dt className={s.factV}>{f.v}</dt>
                <dd className={s.factK}>{f.k}</dd>
              </div>
            ))}
          </dl>
        </footer>
      </div>
    </section>
  )
}
