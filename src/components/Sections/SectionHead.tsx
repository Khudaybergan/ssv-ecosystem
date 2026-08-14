import type { DirectionId } from '../../lib/types'
import { DirectionIcon } from '../../lib/icons'
import { useReveal } from '../../lib/hooks'

interface Props {
  eyebrow: string
  title: string
  lead?: string
  light?: boolean
  /** Иконка направления в моно-метке (заменяет квадратик-маркер) */
  icon?: DirectionId
}

/** Единый заголовок секции: моно-метка, крупный тезис, короткий подзаголовок. */
export function SectionHead({ eyebrow, title, lead, light, icon }: Props) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref}>
      <span className={`eyebrow ${light ? 'eyebrow--light' : ''} ${icon ? 'eyebrow--icon' : ''}`}>
        {icon && <DirectionIcon id={icon} size={15} />}
        {eyebrow}
      </span>
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  )
}
