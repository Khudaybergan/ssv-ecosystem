/* ============================================================
   Доменные типы экосистемы.
   Контент панелей описан типизированными блоками (PanelBlock) —
   при подключении реальных API те же структуры может отдавать бэкенд.
   ============================================================ */

export type DirectionId =
  | 'platform'
  | 'integrations'
  | 'ops'
  | 'ai'
  | 'data'
  | 'services'
  | 'orgs'
  | 'specialists'
  | 'citizens'
  | 'analytics'
  | 'gis'
  | 'education'

export type Ring = 'inner' | 'outer'

export interface Direction {
  id: DirectionId
  /** Название направления */
  name: string
  /** Короткое имя для подписи узла на карте */
  shortName: string
  /** Одна строка для hover-карточки */
  tagline: string
  /** Кольцо орбиты: inner — инфраструктурные слои, outer — участники и сервисы */
  ring: Ring
  /** Связанные направления (подсветка на карте + переходы из панели) */
  related: DirectionId[]
  /** Якорь секции на странице, если у направления есть собственный раздел */
  sectionAnchor?: string
  /** Контент информационной панели */
  panel: PanelBlock[]
}

/* ---------- блоки панели ---------- */

export interface KpiItem {
  value: string
  label: string
}

export type ChipStatus = 'live' | 'pilot' | 'plan' | 'process'

export interface ChipItem {
  name: string
  status?: ChipStatus
}

export interface BarItem {
  label: string
  value: number
  /** Подпись значения (если отличается от числа) */
  display?: string
}

export interface FlowStep {
  title: string
  sub?: string
  /** Ключ иконки (идора ёки тизим) — EcoIcon */
  icon?: string
}

export type PanelBlock =
  | { kind: 'text'; body: string }
  | { kind: 'kpis'; items: KpiItem[] }
  | { kind: 'chips'; title: string; items: ChipItem[] }
  | { kind: 'list'; title: string; items: string[] }
  | { kind: 'bars'; title: string; unit?: string; items: BarItem[] }
  | { kind: 'flow'; title: string; steps: FlowStep[]; twoWay?: boolean }
  | { kind: 'graph'; title: string; center: string; nodes: string[] }
  | { kind: 'stack'; title: string; layers: { title: string; sub: string }[] }
  | { kind: 'link'; label: string; anchor: string }

/* ---------- дерево экосистемы (drill-down) ---------- */

export interface EcoNode {
  id: string
  /** Полное название */
  name: string
  /** Короткая подпись узла на карте (по умолчанию name) */
  label?: string
  /** Аббревиатура внутри круга (DMED, HEMIS…) вместо глифа */
  mark?: string
  /** Ключ иконки организации (см. AGENCY_ICONS) — приоритетнее mark */
  icon?: string
  /** Направление обмена: out — ССВ передаёт, in — принимает, both — двусторонний */
  dir?: 'in' | 'out' | 'both'
  /** Моно-строка под названием в центре карты (только для корня) */
  coreMeta?: string
  /** Заголовок группы детей в мобильном списке */
  childrenLabel?: string
  /** 1–2 предложения для hover-карточки и панели */
  desc: string
  stat?: { value: string; label: string }
  status?: ChipStatus
  /** Узел соответствует направлению верхнего уровня (даёт иконку и насыщенную панель) */
  directionId?: DirectionId
  /** Готовые блоки панели (например, карточка интеграции из реестра) */
  panel?: PanelBlock[]
  children?: EcoNode[]
}

/** Данные для информационной панели (насыщенной или сгенерированной из узла дерева) */
export interface PanelData {
  key: string
  name: string
  tagline: string
  iconId?: DirectionId
  /** Ключ иконки организации/системы (приоритетнее iconId) */
  iconKey?: string
  /** Строка над заголовком: «Направление 02 / 12» или путь «Ядро / Интеграции / DMED» */
  indexLabel: string
  panel: PanelBlock[]
  related: DirectionId[]
}

/* ---------- статистика ---------- */

export interface NationalStats {
  organizations: number
  specialists: number
  doctors: number
  ehrProfiles: number
  digitalServices: number
  integratedSystems: number
  agencies: number
  regionsOnline: number
  regionsTotal: number
  legalActs: number
  uptimePct: number
}

export interface TimelinePoint {
  year: number
  count: number
}

export interface KpiCardData {
  id: string
  label: string
  value: number
  /** Форматированное значение, если требуется (например «37,9 млн») */
  display?: string
  deltaLabel: string
  /** Точки для мини-графика (нормируются при отрисовке) */
  spark: number[]
}

export interface TelemetryEvent {
  system: string
  message: string
  region?: string
}

/* ---------- регионы (GIS) ---------- */

export interface Region {
  id: string
  name: string
  short: string
  capital: string
  /** Медицинские организации */
  orgs: number
  /** Подключение к единой платформе, % */
  coverage: number
  /** Врачи на 10 тыс. населения */
  docsPer10k: number
  /** Активные цифровые сервисы */
  services: number
  /** SVG-путь границы региона */
  path: string
}

export type RegionMetric = 'orgs' | 'coverage' | 'docsPer10k'

/* ---------- архитектура ---------- */

export interface ArchLevel {
  n: number
  title: string
  sub: string
  chips: { label: string; direction?: DirectionId }[]
}
