/* ============================================================
   Drill-down интеграция харитаси (desktop).

   Илдиз: марказда ССВ герби, атрофида — реестр бўйича ҳамкор
   идоралар. Тўғридан-тўғри алмашинувлар — марказга яшил чизиқ;
   «Рақамли ҳукумат» платформаси орқали ўтадиганлари — ўнгдаги
   платформа хабидан ўтувчи кўк тармоқлар (шина схемаси).
   Идорани босганда у марказга ўтади ва алмашинув йўналишлари
   (барглар) очилади; барг ва марказ панелни очади.
   Қайтиш — крошкалар, ← ёки Esc.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { EcoNode } from '../../lib/types'
import { AGENCY_LOGOS, AgencyLogoSvg, EcoIcon, IconCross, isAgencyLogo } from '../../lib/icons'
import s from './Hero.module.css'

const VB_W = 1240
const VB_H = 660
const CX = VB_W / 2
const CY = 330
const EASE = 'cubic-bezier(.22,.61,.24,1)'

interface NodeLayout {
  n: EcoNode
  x: number
  y: number
  r: number
  /** Толщина прямой линии (px) — весомее у идор с бо́льшим числом интеграций */
  ew: number
  /** Прямая связь с центром (null — все обмены идут через платформу) */
  edge: string | null
  /** Толщина ветки через платформу */
  viaEw: number
  /** Ветка узел → платформа-хаб (null — прямых via-обменов нет) */
  viaEdge: string | null
  pulseDur: number
}

interface HubLayout {
  /** Корневой узел «Рақамли ҳукумат» (кликабелен) или null — декоративный хаб уровня */
  n: EcoNode | null
  x: number
  y: number
  r: number
  /** Магистраль хаб → центр */
  trunk: string
  trunkEw: number
  /** Направления через платформу на этом уровне (для магистрали) */
  count: number
  hasIn: boolean
  hasOut: boolean
}

interface LevelLayout {
  ring: NodeLayout[]
  hub: HubLayout | null
}

/** Сколько обменов узла идёт через платформу «Рақамли ҳукумат» */
const viaCountOf = (n: EcoNode) => (n.children ? n.children.filter((k) => k.via).length : n.via ? 1 : 0)

/** Даража жойлашуви: битта ҳалқа; via-гуруҳ ўнгда, платформа хаби улар билан марказ орасида. */
function layoutLevel(focus: EcoNode): LevelLayout {
  const all = focus.children ?? []
  // «Рақамли ҳукумат» ҳалқада турмайди — у платформа хаби бўлади
  const hubNode = all.find((n) => n.id === 'ag-rh') ?? null
  const rest = all.filter((n) => n !== hubNode)
  const viaKids = rest.filter((n) => viaCountOf(n) > 0)
  const dirKids = rest.filter((n) => viaCountOf(n) === 0)
  const hasHub = Boolean(hubNode) || viaKids.length > 0
  const kids = hasHub ? [...viaKids, ...dirKids] : rest
  const c = kids.length
  const rx = c <= 3 ? 300 : c <= 4 ? 350 : c <= 5 ? 405 : c <= 6 ? 450 : c <= 8 ? 495 : c <= 12 ? 512 : c <= 18 ? 520 : 526
  const ry = c <= 3 ? 168 : c <= 4 ? 192 : c <= 5 ? 216 : c <= 6 ? 236 : c <= 8 ? 252 : c <= 12 ? 262 : c <= 18 ? 268 : 274
  // катта ҳалқаларда тугунлар ихчамроқ (26 тагача сиғади)
  const baseR = c <= 8 ? 34 : kids.some((n) => n.icon) ? 28 : c <= 12 ? 26 : c <= 18 ? 24 : 21
  const step = 360 / Math.max(c, 1)
  // via-гуруҳ ўнг томонда (0° атрофида марказлашган); хабсиз даража — аввалгидек
  const start = hasHub && viaKids.length > 0 ? -((viaKids.length - 1) * step) / 2 : c === 2 ? 0 : -90
  const k = c <= 8 ? 0.08 : 0.05
  const hub: HubLayout | null = hasHub
    ? {
        n: hubNode,
        x: CX + rx * 0.47,
        y: CY,
        r: hubNode ? 36 : 27,
        trunk: '',
        trunkEw: 0,
        count: 0,
        hasIn: false,
        hasOut: false,
      }
    : null
  // вес тугуна = интеграциялар сони: кўп интеграцияли идора йирикроқ ва йўғонроқ чизиқли
  const counts = kids.map((n) => n.children?.length ?? 0)
  const maxCount = Math.max(...counts, 1)
  const weighted = maxCount > 1
  const wOf = (m: number) => (weighted ? (m / maxCount) ** 0.55 : 0)
  const ring = kids.map((n, i) => {
    const a = ((start + step * i) * Math.PI) / 180
    // 19+ тугунда ҳалқа икки қаватли: жуфтлари ичкарироқ — ёзувлар тиқилмайди
    const st = c > 18 && i % 2 === 0 ? 0.78 : 1
    const x = CX + rx * st * Math.cos(a)
    const y = CY + ry * st * Math.sin(a)
    const total = Math.max(n.children?.length ?? 1, 1)
    const viaN = hub ? Math.min(viaCountOf(n), total) : 0
    const dirN = total - viaN
    const r = baseR - 2 + wOf(counts[i]) * 13
    let edge: string | null = null
    if (dirN > 0) {
      const mx = (x + CX) / 2 + (CY - y) * k
      const my = (y + CY) / 2 + (x - CX) * k
      edge = `M${x.toFixed(1)},${y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${CX},${CY}`
    }
    let viaEdge: string | null = null
    if (hub && viaN > 0) {
      // ветка выгнута от центра, чтобы огибать ядро
      const mx = (x + hub.x) / 2
      const my = (y + hub.y) / 2
      const qx = mx + (mx - CX) * 0.22
      const qy = my + (my - CY) * 0.22
      viaEdge = `M${x.toFixed(1)},${y.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${hub.x.toFixed(1)},${hub.y.toFixed(1)}`
      hub.count += viaN
      const d = n.dir
      if (d === 'in' || d === 'both') hub.hasIn = true
      if (d === 'out' || d === 'both' || !d) hub.hasOut = true
    }
    return {
      n,
      x,
      y,
      r,
      ew: 1 + wOf(dirN) * 3.2,
      edge,
      viaEw: 1.7 + wOf(viaN) * 3.2,
      viaEdge,
      pulseDur: 2.4 + (i % 4) * 0.45,
    }
  })
  if (hub) {
    hub.count += hubNode?.children?.length ?? 0
    if (hubNode) hub.hasOut = true
    hub.trunk = `M${hub.x.toFixed(1)},${hub.y.toFixed(1)} L${CX},${CY}`
    hub.trunkEw = 2.6 + Math.min(3.4, hub.count * 0.12)
  }
  return { ring, hub }
}

/** Марказ доирасидаги ном: ~14 белгидан тўрт сатргача (узун номлар кичикроқ шрифтда). */
function wrapName(t: string, max = 14): string[] {
  const lines: string[] = []
  let cur = ''
  for (const w of t.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur)
      cur = w
    } else {
      cur = cur ? cur + ' ' + w : w
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 4)
}

interface Props {
  root: EcoNode
  /** Тугун панелини очиш; path — илдиздан тугунгача йўл */
  onOpenNode: (node: EcoNode, path: EcoNode[]) => void
  panelOpen: boolean
  reduced: boolean
}

export function EcosystemMap({ root, onOpenNode, panelOpen, reduced }: Props) {
  const [path, setPath] = useState<EcoNode[]>([root])
  const [hover, setHover] = useState<string | null>(null)
  const layerRef = useRef<SVGGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const focus = path[path.length - 1]
  const depth = path.length - 1
  const atRoot = depth === 0
  const { ring, hub } = useMemo(() => layoutLevel(focus), [focus])

  // корневой узел платформы рисуем как обычный узел, но на позиции хаба
  const hubAsNode: NodeLayout | null =
    hub && hub.n
      ? { n: hub.n, x: hub.x, y: hub.y, r: hub.r, ew: 0, edge: null, viaEw: 0, viaEdge: null, pulseDur: 3 }
      : null
  const drawNodes = hubAsNode ? [...ring, hubAsNode] : ring
  const hubId = hub ? (hub.n ? hub.n.id : 'via-hub') : null

  const hoveredL = hover && hover !== 'core' ? drawNodes.find((l) => l.n.id === hover) : null

  const stateOf = (id: string) => {
    if (!hover) return ''
    if (hover === 'core') return s.rel
    return id === hover ? s.hot : s.dim
  }
  // магистраль «горит», когда навели на платформу или на узел, чьи ветки идут через неё
  const trunkState = !hover
    ? ''
    : hover === 'core'
      ? s.rel
      : hover === hubId || ring.find((l) => l.n.id === hover)?.viaEdge
        ? s.hot
        : s.dim

  /* ---------- даражалар орасидаги ўтишлар ---------- */
  const animate = (out: { origin: string; scale: number }, swap: () => void, inFrom: number) => {
    const el = layerRef.current
    if (!el || busy.current) return
    setHover(null)
    if (reduced) {
      swap()
      return
    }
    busy.current = true
    el.style.transformOrigin = out.origin
    el.style.transition = `transform .3s ${EASE}, opacity .3s ${EASE}`
    el.style.transform = `scale(${out.scale})`
    el.style.opacity = '0'
    window.setTimeout(() => {
      swap()
      el.style.transition = 'none'
      el.style.transformOrigin = `${CX}px ${CY}px`
      el.style.transform = `scale(${inFrom})`
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.style.transition = `transform .36s ${EASE}, opacity .36s ${EASE}`
          el.style.transform = 'scale(1)'
          el.style.opacity = '1'
          window.setTimeout(() => {
            el.style.cssText = ''
            busy.current = false
          }, 380)
        }),
      )
    }, 300)
  }

  const drill = (l: NodeLayout) => {
    if (!l.n.children?.length) {
      onOpenNode(l.n, [...path, l.n])
      return
    }
    animate({ origin: `${l.x}px ${l.y}px`, scale: 1.9 }, () => setPath((p) => [...p, l.n]), 0.82)
    wrapRef.current?.focus({ preventScroll: true })
  }

  const upTo = (index: number) => {
    if (index >= depth) return
    animate({ origin: `${CX}px ${CY}px`, scale: 0.78 }, () => setPath((p) => p.slice(0, index + 1)), 1.7)
    wrapRef.current?.focus({ preventScroll: true })
  }

  // Esc — юқори даражага (панель ёпиқ бўлганда)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !panelOpen && depth > 0) upTo(depth - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen, depth, path])

  const activate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  const centerLines = atRoot ? [] : wrapName(focus.name)
  const hasFocusLogo = isAgencyLogo(focus.icon)

  return (
    <div ref={wrapRef} className={s.mapWrap} tabIndex={-1}>
      {/* йўл крошкалари */}
      {depth > 0 && (
        <nav className={s.crumbs} aria-label="Даражалар бўйича йўл">
          <button className={s.backBtn} onClick={() => upTo(depth - 1)} aria-label="Юқори даражага">
            ←
          </button>
          {path.map((n, i) => (
            <span key={n.id} className={s.crumbItem}>
              {i > 0 && <span className={s.crumbSep}>›</span>}
              {i < depth ? (
                <button className={s.crumb} onClick={() => upTo(i)}>
                  {n.icon &&
                    (isAgencyLogo(n.icon) ? (
                      <img className={s.crumbLogo} src={AGENCY_LOGOS[n.icon]} alt="" />
                    ) : (
                      <EcoIcon id={n.icon} size={12} className={s.crumbIco} />
                    ))}
                  {n.label ?? n.name}
                </button>
              ) : (
                <span className={`${s.crumb} ${s.crumbCur}`}>
                  {n.icon &&
                    (isAgencyLogo(n.icon) ? (
                      <img className={s.crumbLogo} src={AGENCY_LOGOS[n.icon]} alt="" />
                    ) : (
                      <EcoIcon id={n.icon} size={12} className={s.crumbIco} />
                    ))}
                  {n.label ?? n.name}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      <svg
        className={`${s.mapSvg} ${hover ? s.hasHover : ''}`}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label={`Интеграция харитаси, даража: ${focus.name}. Марказ атрофида ${drawNodes.length} та тугун`}
      >
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#12a594" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#12a594" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#12a594" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coreDisc" cx="50%" cy="38%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="72%" stopColor="#f7fcfb" />
            <stop offset="100%" stopColor="#dff1ed" />
          </radialGradient>
          <linearGradient id="coreRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12a594" />
            <stop offset="100%" stopColor="#0b5e6e" />
          </linearGradient>
        </defs>

        <g ref={layerRef} className={s.zoomLayer}>
          {/* орбита йўналтиргичи */}
          {ring.length > 0 && (
            <ellipse
              className={s.orbit}
              cx={CX}
              cy={CY}
              rx={Math.max(...ring.map((l) => Math.abs(l.x - CX)))}
              ry={Math.max(...ring.map((l) => Math.abs(l.y - CY)), 150)}
            />
          )}

          {/* магистраль: платформа-хаб → ССВ маркази */}
          {hub && (
            <g className={`${s.edgeGroup} ${trunkState}`} style={{ '--ew': `${hub.trunkEw.toFixed(1)}px` } as React.CSSProperties}>
              <path className={s.edgeCasing} d={hub.trunk} />
              <path id="edge-trunk" className={s.edgeTrunk} d={hub.trunk} />
              <g className={s.pulses}>
                {[0, 1, 2].map((j) => (
                  <circle key={j} className={s.pulseDotVia} r={3}>
                    <animateMotion
                      dur={`${2 + j * 0.4}s`}
                      begin={`${(-j * 0.9).toFixed(2)}s`}
                      repeatCount="indefinite"
                      keyPoints={hub.hasIn && hub.hasOut ? (j === 1 ? '0;1' : '1;0') : hub.hasIn ? '0;1' : '1;0'}
                      keyTimes="0;1"
                    >
                      <mpath href="#edge-trunk" />
                    </animateMotion>
                  </circle>
                ))}
              </g>
            </g>
          )}

          {/* алоқалар + маълумот пульслари (режадагилар — пунктир, пульссиз) */}
          {ring.map((l, i) => (
            <g
              key={l.n.id}
              className={`${s.edgeGroup} ${l.n.status === 'plan' && !l.n.children?.length ? s.edgePlan : ''} ${stateOf(l.n.id)}`}
              style={{ '--ew': `${l.ew.toFixed(1)}px`, '--vew': `${l.viaEw.toFixed(1)}px` } as React.CSSProperties}
            >
              {l.edge && <path id={`edge-${l.n.id}`} className={s.edge} d={l.edge} />}
              {/* ветка через платформу «Рақамли ҳукумат» (белая подложка отделяет от фото) */}
              {l.viaEdge && <path className={s.edgeViaCasing} d={l.viaEdge} />}
              {l.viaEdge && <path id={`via-${l.n.id}`} className={s.edgeVia} d={l.viaEdge} />}
              <g className={s.pulses}>
                {/* Барг даражасида: барг доирасида ССВ тизими белгиси, марказда — идора.
                    out (ССВ → идора): барг → марказ; in (идора → ССВ): марказ → барг.
                    dir йўқ (илдиз: идоралар, э-рецепт ҳамкорлари) — оқим марказдан
                    ташқарига: ССВдан чиқаётган маълумот. */}
                {l.edge &&
                  [0, 1].map((j) => (
                    <circle key={j} className={s.pulseDot} r={l.r > 30 ? 3.1 : 2.6}>
                      <animateMotion
                        dur={`${l.pulseDur + j * 0.7}s`}
                        begin={`${(-(i * 0.53) - j * (l.pulseDur / 2)).toFixed(2)}s`}
                        repeatCount="indefinite"
                        keyPoints={l.n.dir === 'in' ? '1;0' : l.n.dir === 'both' && j === 1 ? '1;0' : l.n.dir ? '0;1' : '1;0'}
                        keyTimes="0;1"
                      >
                        <mpath href={`#edge-${l.n.id}`} />
                      </animateMotion>
                    </circle>
                  ))}
                {/* ветка via: путь узел → хаб; in — к хабу, иначе — от хаба к узлу */}
                {l.viaEdge &&
                  [0, 1].map((j) => (
                    <circle key={`v${j}`} className={s.pulseDotVia} r={3}>
                      <animateMotion
                        dur={`${1.9 + (i % 3) * 0.4 + j * 0.6}s`}
                        begin={`${(-(i * 0.47) - j * 1.1).toFixed(2)}s`}
                        repeatCount="indefinite"
                        keyPoints={l.n.dir === 'in' ? '0;1' : '1;0'}
                        keyTimes="0;1"
                      >
                        <mpath href={`#via-${l.n.id}`} />
                      </animateMotion>
                    </circle>
                  ))}
              </g>
            </g>
          ))}

          {/* марказ — жорий тугун */}
          <g
            className={s.core}
            role="button"
            tabIndex={0}
            aria-label={`${focus.name} — панелни очиш`}
            onMouseEnter={() => setHover('core')}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover('core')}
            onBlur={() => setHover(null)}
            onClick={() => onOpenNode(focus, path)}
            onKeyDown={activate(() => onOpenNode(focus, path))}
          >
            <circle className={s.coreGlow} cx={CX} cy={CY} r={152} fill="url(#coreGlow)" />
            <g className={s.coreSpin}>
              <circle className={s.coreDash} cx={CX} cy={CY} r={106} />
            </g>
            <circle cx={CX} cy={CY} r={90} fill="none" stroke="url(#coreRing)" strokeWidth="1.4" opacity="0.55" />
            <circle className={s.coreDiscC} cx={CX} cy={CY} r={82} fill="url(#coreDisc)" />
            <g className={s.coreContent} transform={`translate(${CX}, ${CY})`}>
              {atRoot ? (
                <>
                  <image href="/emblem.png" x={-36} y={-62} width={72} height={72} />
                  {wrapName(root.name, 16).map((line, i, arr) => (
                    <text key={i} className={s.coreName} y={30 + i * 16 - (arr.length - 1) * 8} textAnchor="middle">
                      {line}
                    </text>
                  ))}
                  {root.coreMeta && (
                    <text className={s.coreMeta} y="60" textAnchor="middle">
                      {root.coreMeta}
                    </text>
                  )}
                </>
              ) : (
                <>
                  {hasFocusLogo && (
                    <image
                      href={AGENCY_LOGOS[focus.icon!]}
                      x={-29}
                      y={-62}
                      width={58}
                      height={42}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  )}
                  {centerLines.map((line, i) => {
                    const sp = centerLines.length >= 4 ? 15 : 17
                    return (
                      <text
                        key={i}
                        className={`${s.coreName} ${centerLines.length >= 4 ? s.coreNameSm : ''}`}
                        y={(hasFocusLogo ? 10 : -8) + i * sp - ((centerLines.length - 1) * sp) / 2}
                        textAnchor="middle"
                      >
                        {line}
                      </text>
                    )
                  })}
                </>
              )}
            </g>
          </g>

          {/* декоратив платформа-хаб (ички даражаларда) */}
          {hub && !hub.n && (
            <g className={`${s.hubMini} ${trunkState}`} transform={`translate(${hub.x.toFixed(1)}, ${hub.y.toFixed(1)})`}>
              <circle className={s.hubHalo} r={hub.r + 8} />
              <circle className={s.hubBody} r={hub.r} />
              <g transform={`translate(${-hub.r * 0.56}, ${-hub.r * 0.56})`}>
                <AgencyLogoSvg id="rh" size={hub.r * 1.12} />
              </g>
              <text className={s.hubLabel} y={hub.r + 17} textAnchor="middle">
                «Рақамли ҳукумат»
              </text>
              <text className={s.hubSub} y={hub.r + 30} textAnchor="middle">
                интеграция платформаси
              </text>
            </g>
          )}

          {/* даража тугунлари (илдизда охиргиси — платформа хаби) */}
          {drawNodes.map((l) => (
            <g
              key={l.n.id}
              className={`${s.node} ${l.r < 28 ? s.nodeSm : ''} ${l.r < 24 ? s.nodeXs : ''} ${l.n.status === 'plan' && !l.n.children?.length ? s.nodePlan : ''} ${l.n.id === hubId ? s.hubNode : ''} ${stateOf(l.n.id)}`}
              transform={`translate(${l.x.toFixed(1)}, ${l.y.toFixed(1)})`}
              role="button"
              tabIndex={0}
              aria-label={`${l.n.name}. ${l.n.desc} ${l.n.children?.length ? `Ичида ${l.n.children.length} та йўналиш.` : ''}`}
              onMouseEnter={() => setHover(l.n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(l.n.id)}
              onBlur={() => setHover(null)}
              onClick={() => drill(l)}
              onKeyDown={activate(() => drill(l))}
            >
              <g className={s.nodeScale}>
                <circle className={s.nodeHalo} r={l.r + 12} />
                {l.n.id === hubId && <circle className={s.hubHalo} r={l.r + 7} />}
                <circle className={s.nodeBody} r={l.r} />
                {l.n.icon ? (
                  <g transform={`translate(${-l.r * 0.56}, ${-l.r * 0.56})`} className={s.nodeIcon}>
                    {isAgencyLogo(l.n.icon) ? (
                      <AgencyLogoSvg id={l.n.icon} size={l.r * 1.12} />
                    ) : (
                      <EcoIcon id={l.n.icon} size={l.r * 1.12} />
                    )}
                  </g>
                ) : l.n.mark ? (
                  <text className={s.nodeMark} textAnchor="middle" dy="3.5">
                    {l.n.mark}
                  </text>
                ) : (
                  <g className={s.nodeGlyph}>
                    <circle r={l.r < 28 ? 7 : 9} fill="none" strokeWidth="1.8" />
                    <circle r={l.r < 28 ? 2.2 : 2.6} stroke="none" />
                  </g>
                )}
                {l.n.children?.length ? (
                  <g transform={`translate(${l.r * 0.74}, ${-l.r * 0.74})`}>
                    <circle className={s.nodeBadge} r="10.5" />
                    <text className={s.nodeBadgeText} textAnchor="middle" dy="3.5">
                      {l.n.children.length}
                    </text>
                  </g>
                ) : null}
                {l.n.status === 'plan' && !l.n.children?.length && (
                  <g transform={`translate(0, ${l.r})`}>
                    <rect className={s.planChip} x="-21" y="-8" width="42" height="16" rx="8" />
                    <text className={s.planChipText} textAnchor="middle" dy="3.5">
                      2026
                    </text>
                  </g>
                )}
                {(() => {
                  const lines = wrapName(l.n.label ?? l.n.name, l.r < 24 ? 15 : 19).slice(
                    0,
                    l.n.children?.length ? 3 : 2,
                  )
                  const y0 = l.r + (l.n.status === 'plan' ? 25 : 21)
                  return (
                    <text
                      className={`${s.nodeLabel} ${lines.length > 1 ? s.nodeLabelMulti : ''}`}
                      y={y0}
                      textAnchor="middle"
                    >
                      {lines.map((ln, i) => (
                        <tspan key={i} x="0" dy={i === 0 ? 0 : 13.5}>
                          {ln}
                        </tspan>
                      ))}
                    </text>
                  )
                })()}
              </g>
            </g>
          ))}
        </g>

      </svg>

      {/* легенда типов линий — плашка в правом верхнем углу карты */}
      {hub && (
        <div className={s.legendBox} aria-hidden="true">
          <span className={s.legendItem}>
            <i className={`${s.legendSwatch} ${s.legendSwatchDirect}`} />
            Тўғридан-тўғри алмашинув
          </span>
          <span className={s.legendItem}>
            <i className={`${s.legendSwatch} ${s.legendSwatchVia}`} />
            «Рақамли ҳукумат» платформаси орқали
          </span>
        </div>
      )}

      {/* hover-карточка */}
      {hoveredL && (
        <div
          className={`${s.tip} ${hoveredL.x > CX ? s.tipLeft : s.tipRight} ${hoveredL.y < 200 ? s.tipBelow : ''}`}
          style={{ left: `${(hoveredL.x / VB_W) * 100}%`, top: `${(hoveredL.y / VB_H) * 100}%` }}
          aria-hidden="true"
        >
          <span className={s.tipIcon}>
            {hoveredL.n.icon ? (
              isAgencyLogo(hoveredL.n.icon) ? (
                <img className={s.tipLogo} src={AGENCY_LOGOS[hoveredL.n.icon]} alt="" />
              ) : (
                <EcoIcon id={hoveredL.n.icon} size={17} />
              )
            ) : hoveredL.n.mark ? (
              <span className={s.tipMark}>{hoveredL.n.mark}</span>
            ) : (
              <IconCross size={15} />
            )}
          </span>
          <span className={s.tipName}>{hoveredL.n.name}</span>
          <span className={s.tipText}>{hoveredL.n.desc}</span>
          {hoveredL.n.stat && (
            <span className={s.tipStat}>
              <b>{hoveredL.n.stat.value}</b> {hoveredL.n.stat.label}
            </span>
          )}
          <span className={s.tipCta}>{hoveredL.n.children?.length ? 'Ичига кириш →' : 'Очиш →'}</span>
        </div>
      )}
    </div>
  )
}
