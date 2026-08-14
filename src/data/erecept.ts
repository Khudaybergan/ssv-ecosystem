/* ============================================================
   «Электрон рецепт» режими: тизимга уланган дорихона тармоқлари
   ва фарм ахборот тизимлари (фойдаланувчи берган рўйхат).
   ============================================================ */
import type { EcoNode } from '../lib/types'

const PARTNERS = [
  'FOM',
  'OSON Apteka',
  'Мафтуна Фарм Сервис',
  'PharmaUz',
  'ABU.uz',
  'KSB',
  'Dorim',
  'Audit Soft',
  'S-Apteka',
  'Grand Pharm',
  'Asklepiy Group',
  'Navbahor',
  'Pharma cosmos',
  'DoriDarmon - Buxara',
  'DoriDarmon',
  'FarmStandart',
  '7777 Аптека',
]

export const ERECEPT_ROOT: EcoNode = {
  id: 'erx-root',
  name: 'Электрон рецепт',
  label: 'Электрон рецепт',
  desc: 'Электрон рецептлар дорихона тармоқларининг ахборот тизимларига узатилади — рецепт қоғозсиз, дорихонада дарҳол кўринади.',
  stat: { value: String(PARTNERS.length), label: 'ҳамкор тизим' },
  coreMeta: `${PARTNERS.length} ТА ҲАМКОР ТИЗИМ`,
  childrenLabel: 'Ҳамкор тизимлар',
  children: PARTNERS.map((name, i) => ({
    id: `erx-${i + 1}`,
    name,
    desc: '«Электрон рецепт» тизимига уланган дорихона тармоғи ахборот тизими.',
    icon: 'pharm',
    status: 'live' as const,
    stat: { value: 'Уланган', label: 'ҳолат' },
  })),
}
