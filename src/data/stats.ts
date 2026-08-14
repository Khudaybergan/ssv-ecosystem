/* ============================================================
   Миллий кўрсаткичлар ва операцион марказ маълумотлари.
   Қийматлар — намойиш учун; интеграция агрегатлари ССВ
   идоралараро алмашинув реестрига мос (2026 йил март).
   ============================================================ */
import type { ArchLevel, KpiCardData, NationalStats, TelemetryEvent, TimelinePoint } from '../lib/types'
import { REGIONS } from './regions'

export const NATIONAL: NationalStats = {
  organizations: REGIONS.reduce((s, r) => s + r.orgs, 0),
  specialists: 512_400,
  doctors: 118_300,
  ehrProfiles: 36_800_000,
  digitalServices: 128,
  integratedSystems: 56,
  agencies: 14,
  regionsOnline: 14,
  regionsTotal: 14,
  legalActs: 24,
  uptimePct: 99.97,
}

/** Йиллар бўйича янги идоралараро интеграциялар (ССВ реестри). */
export const INTEGRATION_TIMELINE: TimelinePoint[] = [
  { year: 2020, count: 1 },
  { year: 2021, count: 7 },
  { year: 2023, count: 10 },
  { year: 2024, count: 15 },
  { year: 2025, count: 16 },
  { year: 2026, count: 4 },
]

export const OPS_KPIS: KpiCardData[] = [
  {
    id: 'orgs',
    label: 'Тиббий ташкилотлар',
    value: NATIONAL.organizations,
    deltaLabel: 'йилига +1,8 %',
    spark: [72, 74, 75, 78, 80, 83, 86, 90, 93, 96, 98, 100],
  },
  {
    id: 'staff',
    label: 'Тиббиёт ходимлари',
    value: NATIONAL.specialists,
    deltaLabel: 'йилига +3,2 %',
    spark: [80, 81, 83, 84, 86, 88, 89, 92, 94, 96, 98, 100],
  },
  {
    id: 'ehr',
    label: 'Электрон тиббий карталар',
    value: NATIONAL.ehrProfiles,
    display: '36,8 млн',
    deltaLabel: 'ойига +412 минг',
    spark: [40, 47, 53, 58, 64, 70, 75, 81, 86, 91, 96, 100],
  },
  {
    id: 'services',
    label: 'Рақамли хизматлар',
    value: NATIONAL.digitalServices,
    deltaLabel: 'чоракда +9',
    spark: [52, 55, 58, 63, 66, 70, 76, 80, 85, 90, 95, 100],
  },
  {
    id: 'systems',
    label: 'Интеграциялашган тизимлар',
    value: NATIONAL.integratedSystems,
    deltaLabel: '14 идора',
    spark: [15, 18, 20, 33, 36, 45, 52, 60, 74, 84, 94, 100],
  },
  {
    id: 'appeals',
    label: 'Бугунги мурожаатлар',
    value: 214_600,
    display: '214,6 минг',
    deltaLabel: 'чўққи 11:00–12:00',
    spark: [30, 42, 60, 78, 92, 100, 96, 88, 80, 72, 60, 48],
  },
]

/** Операцион марказ воқеалар оқими (намойиш телеметрияси). */
export const TELEMETRY: TelemetryEvent[] = [
  { system: 'DMED', message: 'госпитал эпикризи ягона тиббий картага узатилди', region: 'Тошкент' },
  { system: 'Е-рецепт', message: 'рецепт берилди ва дорихона тармоғида кўринмоқда', region: 'Самарқанд вил.' },
  { system: '103', message: 'чақирув тез ёрдам бригадасига узатилди', region: 'Наманган вил.' },
  { system: 'Скрининг', message: 'флюорография СИ таҳлили: хавф аниқланмади', region: 'Бухоро вил.' },
  { system: 'Ёзилиш', message: 'кардиолог қабули илова орқали тасдиқланди', region: 'Фарғона вил.' },
  { system: 'Лаборатория', message: 'таҳлил натижалари шахсий кабинетга етказилди', region: 'Хоразм вил.' },
  { system: 'Интеграция', message: 'Ижтимоий ҳимоя агентлиги билан реестр солиштируви якунланди' },
  { system: 'Телетиббиёт', message: 'туман шифохонаси ва ихтисослашган марказ маслаҳати', region: 'Қорақалпоғистон' },
  { system: 'Маълумотнома', message: '086 маълумотномаси давлат хизматлари портали учун шакллантирилди', region: 'Тошкент вил.' },
  { system: 'Мониторинг', message: 'барча 14 ҳудудий тугун алоқада, кечикиш < 90 мс' },
]

/** Экотизим архитектураси даражалари (юқоридан пастга — фуқародан бошқарувгача). */
export const ARCH_LEVELS: ArchLevel[] = [
  {
    n: 1,
    title: 'Фуқаролар ва беморлар',
    sub: 'ўз саломатлигига ягона кириш нуқтаси',
    chips: [
      { label: 'Шахсий кабинет', direction: 'citizens' },
      { label: 'Мобил илова', direction: 'citizens' },
      { label: 'Давлат хизматлари портали' },
    ],
  },
  {
    n: 2,
    title: 'Тиббий хизматлар',
    sub: 'ёзилиш, рецептлар, маълумотномалар, телетиббиёт',
    chips: [
      { label: 'Шифокорга ёзилиш', direction: 'services' },
      { label: 'Электрон рецепт', direction: 'services' },
      { label: 'Маълумотномалар', direction: 'services' },
      { label: 'Телетиббиёт', direction: 'services' },
    ],
  },
  {
    n: 3,
    title: 'Ташкилотлар ва мутахассислар',
    sub: 'муассасалар тармоғи ва шифокорнинг рақамли воситалари',
    chips: [
      { label: '6 040 ташкилот', direction: 'orgs' },
      { label: '512 минг мутахассис', direction: 'specialists' },
      { label: 'Муассаса АТлари' },
    ],
  },
  {
    n: 4,
    title: 'Ягона рақамли платформа',
    sub: 'реестрлар, маълумотномалар, маълумотлар шинаси, интеграциялар',
    chips: [
      { label: 'Платформа ядроси', direction: 'platform' },
      { label: 'API-шлюз', direction: 'integrations' },
      { label: '56 интеграция', direction: 'integrations' },
    ],
  },
  {
    n: 5,
    title: 'Маълумотлар · СИ · Таҳлил',
    sub: 'маълумотлар оқими устидаги интеллектуал қатлам',
    chips: [
      { label: 'Тиббий маълумотлар', direction: 'data' },
      { label: 'СИ моделлари', direction: 'ai' },
      { label: 'Таҳлил', direction: 'analytics' },
      { label: 'ГАТ', direction: 'gis' },
    ],
  },
  {
    n: 6,
    title: 'Давлат бошқаруви',
    sub: 'вазирликнинг маълумотларга асосланган қарорлари',
    chips: [
      { label: 'Операцион марказ', direction: 'ops' },
      { label: 'Кўрсаткичлар мониторинги', direction: 'analytics' },
      { label: 'Норматив база' },
    ],
  },
]
