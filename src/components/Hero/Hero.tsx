import { useRef } from 'react'
import type { EcoNode } from '../../lib/types'
import { useMedia, usePrefersReducedMotion } from '../../lib/hooks'
import { EcosystemMap } from './EcosystemMap'
import { MobileEcosystem } from './MobileEcosystem'
import heroBg from '../../assets/hero-bg.jpg'
import s from './Hero.module.css'

interface Props {
  root: EcoNode
  onOpenNode: (node: EcoNode, path: EcoNode[]) => void
  panelOpen: boolean
}

export function Hero({ root, onOpenNode, panelOpen }: Props) {
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
        </div>

        <div ref={mapRef} className={s.mapLayer}>
          {compact ? (
            <MobileEcosystem root={root} onOpenNode={onOpenNode} />
          ) : (
            <EcosystemMap root={root} onOpenNode={onOpenNode} panelOpen={panelOpen} reduced={reduced} />
          )}
        </div>

      </div>

      <a className={s.scrollCue} href="#ops" aria-label="Операцион марказга">
        <span className={s.scrollDot} />
      </a>
    </section>
  )
}
