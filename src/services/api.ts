/* ============================================================
   Сервисный слой данных.

   Сейчас источники локальные (src/data/*). При подключении реальных
   систем (DMED, ГИС, аналитические витрины, AI-модули) достаточно
   заменить реализацию функций на fetch к соответствующим API —
   сигнатуры и типы останутся прежними для всего интерфейса.

   Пример:
     export async function getNationalStats(): Promise<NationalStats> {
       const r = await fetch(`${API_BASE}/v1/stats/national`)
       return r.json()
     }
   ============================================================ */
import type { Direction, KpiCardData, NationalStats, Region, TelemetryEvent, TimelinePoint } from '../lib/types'
import { DIRECTIONS } from '../data/directions'
import { INTEGRATION_TIMELINE, NATIONAL, OPS_KPIS, TELEMETRY } from '../data/stats'
import { REGIONS } from '../data/regions'

export async function getDirections(): Promise<Direction[]> {
  return DIRECTIONS
}

export async function getNationalStats(): Promise<NationalStats> {
  return NATIONAL
}

export async function getOpsKpis(): Promise<KpiCardData[]> {
  return OPS_KPIS
}

export async function getTelemetry(): Promise<TelemetryEvent[]> {
  return TELEMETRY
}

export async function getRegions(): Promise<Region[]> {
  return REGIONS
}

export async function getIntegrationTimeline(): Promise<TimelinePoint[]> {
  return INTEGRATION_TIMELINE
}
