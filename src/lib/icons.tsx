/* ============================================================
   Минималистичные линейные иконки направлений (24×24, stroke).
   Единый стиль: скруглённые окончания, толщина 1.75.
   ============================================================ */
import type { SVGProps } from 'react'
import type { DirectionId } from './types'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 24, ...rest }: IconProps, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconPlatform = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 3 4 7l8 4 8-4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </>,
  )

export const IconIntegrations = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="5.5" cy="12" r="2.5" />
      <circle cx="18.5" cy="5.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="M7.8 10.8 16.2 6.6M7.8 13.2l8.4 4.2" />
    </>,
  )

export const IconOps = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="M12 17a5 5 0 1 1 5-5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="m12 12 6.5-6.5" />
    </>,
  )

export const IconAi = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20" />
      <rect x="8" y="8" width="8" height="8" rx="2.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>,
  )

export const IconData = (p: IconProps) =>
  base(
    p,
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      <path d="M5 11.5v6C5 18.9 8.1 20 12 20s7-1.1 7-2.5v-6" />
    </>,
  )

export const IconServices = (p: IconProps) =>
  base(
    p,
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
      <path d="M16.75 14.5v5M14.25 17h5" />
    </>,
  )

export const IconOrgs = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M4 21V8l8-5 8 5v13" />
      <path d="M4 21h16" />
      <path d="M12 10v6M9 13h6" />
    </>,
  )

export const IconSpecialists = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
      <path d="M9.5 18h5" />
    </>,
  )

export const IconCitizens = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 15.2c2.7.2 4.5 2 4.5 4.8" />
    </>,
  )

export const IconAnalytics = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M4 20h16" />
      <path d="M6.5 20v-6M11.5 20V9M16.5 20v-9.5" />
      <path d="m5 8.5 5-3.5 4 2.5 5-4" />
    </>,
  )

export const IconGis = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 1 1 13 0c0 4.5-6.5 10-6.5 10Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>,
  )

export const IconEducation = (p: IconProps) =>
  base(
    p,
    <>
      <path d="m12 4 10 4.5L12 13 2 8.5 12 4Z" />
      <path d="M6.5 10.5V16c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-5.5" />
      <path d="M22 8.5V14" />
    </>,
  )

/* ---------- utility icons ---------- */

export const IconArrow = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>,
  )

export const IconClose = (p: IconProps) =>
  base(
    p,
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>,
  )

export const IconMenu = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>,
  )

export const IconCross = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 5v14M5 12h14" />
    </>,
  )

export const DIRECTION_ICONS: Record<DirectionId, (p: IconProps) => React.ReactNode> = {
  platform: IconPlatform,
  integrations: IconIntegrations,
  ops: IconOps,
  ai: IconAi,
  data: IconData,
  services: IconServices,
  orgs: IconOrgs,
  specialists: IconSpecialists,
  citizens: IconCitizens,
  analytics: IconAnalytics,
  gis: IconGis,
  education: IconEducation,
}

export function DirectionIcon({ id, ...p }: IconProps & { id: DirectionId }) {
  const C = DIRECTION_ICONS[id]
  return <>{C(p)}</>
}

/* ============================================================
   Иконки организаций-партнёров (реестр интеграций).
   Тот же стиль: 24×24, stroke 1.75, скруглённые окончания.
   ============================================================ */

export const AGENCY_ICONS: Record<string, (p: IconProps) => React.ReactNode> = {
  // Ижтимоий ҳимоя — щит с сердцем
  social: (p) =>
    base(
      p,
      <>
        <path d="M12 3l7 2.8v5.3c0 4.4-2.9 7.7-7 9.9-4.1-2.2-7-5.5-7-9.9V5.8L12 3z" />
        <path d="M12 14.4l-2.4-2.4a1.65 1.65 0 0 1 2.3-2.3l.1.1.1-.1a1.65 1.65 0 0 1 2.3 2.3L12 14.4z" />
      </>,
    ),
  // ЭТРМ — микросхема
  etrm: (p) =>
    base(
      p,
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <rect x="10.4" y="10.4" width="3.2" height="3.2" />
        <path d="M9.5 7V4.5M14.5 7V4.5M9.5 19.5V17M14.5 19.5V17M7 9.5H4.5M7 14.5H4.5M19.5 9.5H17M19.5 14.5H17" />
      </>,
    ),
  // Тиббий суғурта — щит с крестом
  insurance: (p) =>
    base(
      p,
      <>
        <path d="M12 3l7 2.8v5.3c0 4.4-2.9 7.7-7 9.9-4.1-2.2-7-5.5-7-9.9V5.8L12 3z" />
        <path d="M12 8.6v5M9.5 11.1h5" />
      </>,
    ),
  // Ҳисоб палатаси — планшет аудита
  hisob: (p) =>
    base(
      p,
      <>
        <rect x="6" y="4" width="12" height="17" rx="2" />
        <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
        <path d="M9 10.5h6M9 14h6M9 17.5h3.5" />
      </>,
    ),
  // Солиқ қўмитаси — процент
  soliq: (p) =>
    base(
      p,
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.2 14.8l5.6-5.6" />
        <circle cx="9.5" cy="9.5" r="1.2" />
        <circle cx="14.5" cy="14.5" r="1.2" />
      </>,
    ),
  // ИИВ — щит со звездой
  iiv: (p) =>
    base(
      p,
      <>
        <path d="M12 3l7 2.8v5.3c0 4.4-2.9 7.7-7 9.9-4.1-2.2-7-5.5-7-9.9V5.8L12 3z" />
        <path d="M12 8.4l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3 1-2z" />
      </>,
    ),
  // Иқтисодиёт ва молия — здание банка
  moliya: (p) =>
    base(
      p,
      <>
        <path d="M4 9.5l8-5.5 8 5.5" />
        <path d="M5.5 9.5V18M10 9.5V18M14 9.5V18M18.5 9.5V18" />
        <path d="M3.5 18h17M3.5 20.5h17" />
      </>,
    ),
  // Мудофаа — звезда
  mudofaa: (p) =>
    base(
      p,
      <path d="M12 3.5l2.2 4.6 5.1.7-3.7 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.7-3.5 5.1-.7L12 3.5z" />,
    ),
  // Адлия — весы
  adliya: (p) =>
    base(
      p,
      <>
        <path d="M12 4.5V19M7 7h10M9 19h6" />
        <path d="M7 7l-2.4 5a2.7 2.7 0 0 0 4.8 0L7 7zM17 7l-2.4 5a2.7 2.7 0 0 0 4.8 0L17 7z" />
      </>,
    ),
  // Ёшлар агентлиги — флаг
  yoshlar: (p) =>
    base(
      p,
      <>
        <path d="M6 21V4" />
        <path d="M6 5c2-1.2 4-1.2 6 0s4 1.2 6 0v8c-2 1.2-4 1.2-6 0s-4-1.2-6 0" />
      </>,
    ),
  // Мактаб таълими — раскрытая книга
  maktab: (p) =>
    base(
      p,
      <>
        <path d="M12 6.2c-1.9-1.4-4.3-1.9-7.5-1.9v13.5c3.2 0 5.6.5 7.5 1.9 1.9-1.4 4.3-1.9 7.5-1.9V4.3c-3.2 0-5.6.5-7.5 1.9z" />
        <path d="M12 6.2v13.5" />
      </>,
    ),
  // Оила қўмитаси — взрослый и ребёнок
  oila: (p) =>
    base(
      p,
      <>
        <circle cx="9" cy="7.3" r="2.6" />
        <circle cx="16.2" cy="9.3" r="2" />
        <path d="M4.5 18.5c0-2.9 2-4.7 4.5-4.7s4.5 1.8 4.5 4.7" />
        <path d="M14.6 18.5c0-2.2 1.1-3.6 2.7-3.6 1.4 0 2.4 1 2.7 2.7" />
      </>,
    ),
  // Техник тартибга солиш — шестерня
  tech: (p) =>
    base(
      p,
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.6v2.2M12 18.2v2.2M3.6 12h2.2M18.2 12h2.2M6.1 6.1l1.5 1.5M16.4 16.4l1.5 1.5M17.9 6.1l-1.5 1.5M7.6 16.4l-1.5 1.5" />
      </>,
    ),
  // Фармацевтика — капсула
  pharm: (p) =>
    base(
      p,
      <>
        <rect x="7.6" y="3.4" width="8.8" height="17.2" rx="4.4" transform="rotate(45 12 12)" />
        <path d="M9.2 14.8l5.6-5.6" />
      </>,
    ),
  // ОИТС маркази — лента
  oits: (p) =>
    base(
      p,
      <>
        <path d="M12 3.2c2.7 1.8 3.9 3.5 3.9 5.3 0 2-1.4 4.1-4.1 7.1L7.2 20.5" />
        <path d="M12 3.2C9.3 5 8.1 6.7 8.1 8.5c0 2 1.4 4.1 4.1 7.1l4.6 4.9" />
      </>,
    ),
  // Рақамли ҳукумат — глобус
  rh: (p) =>
    base(
      p,
      <>
        <circle cx="12" cy="12" r="8.5" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
        <path d="M4.2 9.2h15.6M4.2 14.8h15.6" />
      </>,
    ),
}

export function AgencyIcon({ id, ...p }: IconProps & { id: string }) {
  const C = AGENCY_ICONS[id]
  return C ? <>{C(p)}</> : <IconCross {...p} />
}

/* ============================================================
   Иконки ахборот тизимлари ССВ (реестрдаги 12 тизим).
   ============================================================ */

export const SYSTEM_ICONS: Record<string, (p: IconProps) => React.ReactNode> = {
  // DMED — электрон тиббий карта
  dmed: (p) =>
    base(
      p,
      <>
        <rect x="4.5" y="4" width="15" height="16.5" rx="2.2" />
        <path d="M12 8v4.4M9.8 10.2h4.4M8.5 16.5h7" />
      </>,
    ),
  // Рақамли соғлиқ платформаси — булут + крест
  rsp: (p) =>
    base(
      p,
      <>
        <path d="M7.3 17.5a4.2 4.2 0 0 1-.5-8.4 5.3 5.3 0 0 1 10.4.9 3.5 3.5 0 0 1-.4 7.5H7.3z" />
        <path d="M12 11.2v3.6M10.2 13h3.6" />
      </>,
    ),
  // narko-psix — руҳий саломатлик (бош + плюс)
  npx: (p) =>
    base(
      p,
      <>
        <path d="M15.3 20.5v-2.8h1.5c.8 0 1.3-.8 1-1.5l-.8-1.7a6.6 6.6 0 1 0-9.2 3.6v2.4" />
        <path d="M10.6 9.7h4M12.6 7.7v4" />
      </>,
    ),
  // MIS2 — монитор + пульс
  mis2: (p) =>
    base(
      p,
      <>
        <rect x="4" y="5" width="16" height="11.5" rx="2" />
        <path d="M7 11h2l1.2-2.3 1.7 4.2 1.3-1.9H17" />
        <path d="M12 16.5v3.2M9 19.7h6" />
      </>,
    ),
  // HIV-ES — лента
  hiv: (p) =>
    base(
      p,
      <>
        <path d="M12 3.2c2.7 1.8 3.9 3.5 3.9 5.3 0 2-1.4 4.1-4.1 7.1L7.2 20.5" />
        <path d="M12 3.2C9.3 5 8.1 6.7 8.1 8.5c0 2 1.4 4.1 4.1 7.1l4.6 4.9" />
      </>,
    ),
  // Туғилиш/ўлим қайди — гувоҳнома + муҳр
  birth: (p) =>
    base(
      p,
      <>
        <path d="M18.5 13.5V5.5a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h5" />
        <path d="M9 7.5h6M9 10.8h6" />
        <circle cx="16.3" cy="17.3" r="2.5" />
        <path d="M15.2 19.5l-.6 1.9M17.4 19.5l.6 1.9" />
      </>,
    ),
  // Medrefer — йўлланма (ҳужжат + стрелка)
  mdr: (p) =>
    base(
      p,
      <>
        <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2H14" />
        <path d="M11 12h9.5M18 9.5L20.5 12 18 14.5" />
      </>,
    ),
  // Cancer-registr — ҳужайралар
  canc: (p) =>
    base(
      p,
      <>
        <circle cx="9" cy="9.3" r="3.4" />
        <circle cx="15.8" cy="12.2" r="2.5" />
        <circle cx="10.8" cy="16.2" r="2.1" />
      </>,
    ),
  // Донор ҳисоби — қон томчиси
  donor: (p) =>
    base(
      p,
      <>
        <path d="M12 3.3c3.6 4.3 5.6 7.4 5.6 10.2a5.6 5.6 0 1 1-11.2 0C6.4 10.7 8.4 7.6 12 3.3z" />
        <path d="M9.3 13.8a2.7 2.7 0 0 0 2.2 2.7" />
      </>,
    ),
  // ЖиҳозМед — стетоскоп
  jm: (p) =>
    base(
      p,
      <>
        <path d="M6.5 3.5v5a4 4 0 0 0 8 0v-5" />
        <path d="M10.5 12.4V16a4 4 0 0 0 8 0v-1.7" />
        <circle cx="18.5" cy="11.9" r="2.4" />
      </>,
    ),
  // МедДата — тез ёрдам машинаси
  amb: (p) =>
    base(
      p,
      <>
        <path d="M3 15.5V8.5h10.5l2.4 3h3.6a1 1 0 0 1 1 1v3h-2.3" />
        <circle cx="7.7" cy="17.2" r="1.9" />
        <circle cx="16.3" cy="17.2" r="1.9" />
        <path d="M3 15.5h2.8M9.6 17.2h4.8" />
        <path d="M7.5 10.2v3M6 11.7h3" />
      </>,
    ),
  // Автохўжалик — автомобиль
  avto: (p) =>
    base(
      p,
      <>
        <path d="M6 13.8l1.5-4A1.8 1.8 0 0 1 9.2 8.6h5.6a1.8 1.8 0 0 1 1.7 1.2l1.5 4" />
        <path d="M3.5 17.5v-2.2a1.5 1.5 0 0 1 1.5-1.5h14a1.5 1.5 0 0 1 1.5 1.5v2.2" />
        <circle cx="7.6" cy="17.6" r="1.9" />
        <circle cx="16.4" cy="17.6" r="1.9" />
        <path d="M9.5 17.6h5" />
      </>,
    ),
}

/** Универсал иконка: идора ёки тизим калити бўйича. */
export function EcoIcon({ id, ...p }: IconProps & { id: string }) {
  const C = AGENCY_ICONS[id] ?? SYSTEM_ICONS[id]
  return C ? <>{C(p)}</> : <IconCross {...p} />
}
