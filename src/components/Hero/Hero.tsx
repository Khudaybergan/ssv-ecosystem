import { useRef, useState } from 'react'
import type { EcoNode } from '../../lib/types'
import { ECOSYSTEM_ROOT } from '../../data/tree'
import { ERECEPT_ROOT } from '../../data/erecept'
import { useMedia, usePrefersReducedMotion } from '../../lib/hooks'
import { EcosystemMap } from './EcosystemMap'
import { MobileEcosystem } from './MobileEcosystem'
import heroBg from '../../../Ministry_of_Health_(Tashkent).jpg'
import s from './Hero.module.css'

interface Props {
  onOpenNode: (node: EcoNode, path: EcoNode[]) => void
  panelOpen: boolean
}

/** Харита режимлари: идоралараро интеграция ёки «Электрон рецепт» */
const MODES = [
  { id: 'gov', label: 'Идоралараро интеграция', root: ECOSYSTEM_ROOT },
  { id: 'erx', label: 'Электрон рецепт', root: ERECEPT_ROOT },
] as const

export function Hero({ onOpenNode, panelOpen }: Props) {
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('gov')
  const root = MODES.find((m) => m.id === mode)!.root
  const compact = useMedia('(max-width: 940px)')
  const reduced = usePrefersReducedMotion()
  const finePointer = useMedia('(pointer: fine)')
  const bgRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  // лёгкий параллакс фона и карты за курсором
  const onMove = (e: React.MouseEvent) => {
    if (reduced || !finePointer) return
    const { innerWidth: w, innerHeight: h } = window
    const nx = e.clientX / w - 0.5
    const ny = e.clientY / h - 0.5
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      if (bgRef.current) bgRef.current.style.transform = `scale(1.04) translate(${nx * -10}px, ${ny * -6}px)`
      if (mapRef.current) mapRef.current.style.transform = `translate(${nx * 9}px, ${ny * 6}px)`
    })
  }

  return (
    <section id="ecosystem" className={s.hero} onMouseMove={onMove}>
      <div className={s.bg} aria-hidden="true">
        <div ref={bgRef} className={s.bgImgWrap}>
          <img className={s.bgImg} src={heroBg} alt="" />
        </div>
        <div className={s.bgHaze} />
      </div>

      <div className={s.inner}>
        <div className={s.mapHead}>
          <span className={s.mapEyebrow}>Ўзбекистон Республикаси</span>
          <h1 className={s.mapTitle}>Соғлиқни сақлаш вазирлиги</h1>
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

        <div ref={mapRef} className={s.mapLayer}>
          {compact ? (
            <MobileEcosystem key={mode} root={root} onOpenNode={onOpenNode} />
          ) : (
            <EcosystemMap key={mode} root={root} onOpenNode={onOpenNode} panelOpen={panelOpen} reduced={reduced} />
          )}
        </div>

      </div>
    </section>
  )
}
