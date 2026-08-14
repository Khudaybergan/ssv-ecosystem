import { useCallback, useState } from 'react'
import type { DirectionId, EcoNode, PanelBlock, PanelData } from './lib/types'
import { DIRECTIONS, DIRECTION_BY_ID } from './data/directions'
import { TopBar } from './components/TopBar/TopBar'
import { Hero } from './components/Hero/Hero'
import { InfoPanel } from './components/Panel/InfoPanel'

/** Юқори даража йўналишининг тўлиқ панели */
function panelFromDirection(id: DirectionId): PanelData {
  const d = DIRECTION_BY_ID[id]
  const index = DIRECTIONS.findIndex((x) => x.id === id) + 1
  return {
    key: `dir-${id}`,
    name: d.name,
    tagline: d.tagline,
    iconId: id,
    indexLabel: `Йўналиш ${String(index).padStart(2, '0')} / ${DIRECTIONS.length}`,
    panel: d.panel,
    related: d.related,
  }
}

const STATUS_UZ: Record<string, string> = { live: 'Ишлайди', pilot: 'Пилот', plan: 'Режада', process: 'Жараёнда' }

/** Дарахт тугуни учун генерацияланган панель (чуқур даражалар ва барглар) */
function panelFromNode(node: EcoNode, path: EcoNode[]): PanelData {
  // тугун тавсифи панель сарлавҳасида (tagline) кўринади — блоклар фақат фактлар билан
  const blocks: PanelBlock[] = []

  if (node.panel) {
    // тугунда тайёр блоклар бор (масалан, реестрдаги интеграция карточкаси)
    blocks.push(...node.panel)
  } else {
    const kpis: { value: string; label: string }[] = []
    if (node.stat) kpis.push(node.stat)
    if (node.children?.length) kpis.push({ value: String(node.children.length), label: 'та компонент' })
    if (node.status) kpis.push({ value: STATUS_UZ[node.status], label: 'ҳолат' })
    if (kpis.length) blocks.push({ kind: 'kpis', items: kpis })

    if (node.children?.length) {
      blocks.push({
        kind: 'chips',
        title: 'Таркиб',
        items: node.children.map((c) => ({ name: c.label ?? c.name, status: c.status })),
      })
    }
  }

  // страховка: узел без фактов показывает хотя бы описание
  if (!blocks.length) blocks.push({ kind: 'text', body: node.desc })

  // энг яқин аждод-йўналиш — иконка ва «йўналишга ўтиш» учун
  const ancestorDir = [...path].reverse().find((n) => n.directionId)?.directionId

  return {
    key: `node-${node.id}`,
    name: node.name,
    tagline: node.desc,
    iconId: ancestorDir,
    iconKey: node.icon,
    indexLabel: path.map((n) => n.label ?? n.name).join(' / '),
    panel: blocks,
    related: ancestorDir && ancestorDir !== node.directionId ? [ancestorDir] : [],
  }
}

export default function App() {
  const [panel, setPanel] = useState<PanelData | null>(null)

  const openDirection = useCallback((id: DirectionId) => setPanel(panelFromDirection(id)), [])

  const openNode = useCallback((node: EcoNode, path: EcoNode[]) => {
    // юқори даража йўналиши тўлиқ панель олади, қолганлари — генерацияланган
    setPanel(node.directionId ? panelFromDirection(node.directionId) : panelFromNode(node, path))
  }, [])

  const closePanel = useCallback(() => setPanel(null), [])

  return (
    <>
      <TopBar />
      <main>
        <Hero onOpenNode={openNode} panelOpen={panel !== null} />
      </main>
      <InfoPanel data={panel} onClose={closePanel} onOpen={openDirection} />
    </>
  )
}
