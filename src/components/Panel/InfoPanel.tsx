/* ============================================================
   Информационная панель: выезжает поверх интерфейса.
   Принимает готовые PanelData — насыщенные (12 направлений)
   или сгенерированные из узла дерева любого уровня.
   ============================================================ */
import { useEffect, useRef } from 'react'
import type { DirectionId, PanelData } from '../../lib/types'
import { DIRECTION_BY_ID } from '../../data/directions'
import { AGENCY_LOGOS, DirectionIcon, EcoIcon, IconClose, IconCross, isAgencyLogo } from '../../lib/icons'
import { PanelBlockView } from './PanelBlocks'
import s from './InfoPanel.module.css'

interface Props {
  data: PanelData | null
  onClose: () => void
  onOpen: (id: DirectionId) => void
}

export function InfoPanel({ data, onClose, onOpen }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // блокировка прокрутки страницы + фокус на панели
  useEffect(() => {
    if (!data) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    bodyRef.current?.scrollTo({ top: 0 })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [data, onClose])

  if (!data) return null

  const goAnchor = (anchor: string) => {
    onClose()
    // даём панели закрыться, затем плавно прокручиваем к секции
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className={s.panel} role="dialog" aria-modal="true" aria-label={data.name}>
        <header className={s.head}>
          <div className={s.headTop}>
            <span className={s.eyebrow}>{data.indexLabel}</span>
            <button ref={closeRef} className={s.close} onClick={onClose} aria-label="Панелни ёпиш">
              <IconClose size={20} />
            </button>
          </div>
          <div className={s.headMain}>
            <span className={s.headIcon}>
              {data.iconKey ? (
                isAgencyLogo(data.iconKey) ? (
                  <img className={s.headLogo} src={AGENCY_LOGOS[data.iconKey]} alt="" />
                ) : (
                  <EcoIcon id={data.iconKey} size={26} />
                )
              ) : data.iconId ? (
                <DirectionIcon id={data.iconId} size={26} />
              ) : (
                <IconCross size={24} />
              )}
            </span>
            <h2 className={s.title}>{data.name}</h2>
          </div>
          <p className={s.tagline}>{data.tagline}</p>
        </header>

        <div ref={bodyRef} className={s.body}>
          {data.panel.map((b, i) => (
            <PanelBlockView key={i} block={b} onAnchor={goAnchor} />
          ))}

          {data.related.length > 0 && (
            <div className={s.related}>
              <h4 className={s.bTitle}>Боғлиқ йўналишлар</h4>
              <div className={s.relatedRow}>
                {data.related.map((id) => {
                  const rd = DIRECTION_BY_ID[id]
                  return (
                    <button key={id} className={s.relatedChip} onClick={() => onOpen(id)}>
                      <DirectionIcon id={id} size={16} />
                      {rd.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
