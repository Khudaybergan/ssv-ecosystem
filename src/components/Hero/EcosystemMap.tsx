/* ============================================================
   Drill-down интеграция харитаси (desktop).

   Илдиз: марказда ССВ герби, атрофида — реестр бўйича ҳамкор
   идоралар. Барча алоқалар радиал: тўғридан-тўғри алмашинувлар —
   яшил чизиқлар; «Рақамли ҳукумат» платформаси орқали ўтадиганлари —
   ўнг сектордаги кўк дуга-шлюзни тешиб ўтувчи кўк чизиқлар
   (кесишган жойда порт-нуқта). Дуга — платформанинг ўзи
   (илдизда босса — ичига киради).
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
  /** Толщина линии связи (px) — весомее у идор с бо́льшим числом интеграций */
  ew: number
  edge: string
  /** Обмены узла идут через платформу (линия синяя, сквозь дугу-шлюз) */
  isVia: boolean
  /** Точка пересечения линии с дугой-шлюзом */
  port: { x: number; y: number } | null
  pulseDur: number
}

interface GateLayout {
  /** Корневой узел «Рақамли ҳукумат» (кликабелен) или null — декоративный шлюз уровня */
  n: EcoNode | null
  /** Дуга-шлюз (эллиптическая) */
  arc: string
  /** Медальон с логотипом на дуге */
  mx: number
  my: number
  mr: number
  /** Собственные обмены платформы (бейдж на медальоне) */
  count: number
}

interface LevelLayout {
  ring: NodeLayout[]
  gate: GateLayout | null
}

/** Сколько обменов узла идёт через платформу «Рақамли ҳукумат» */
const viaCountOf = (n: EcoNode) => (n.children ? n.children.filter((k) => k.via).length : n.via ? 1 : 0)

/** Даража жойлашуви: битта радиал ҳалқа; via-гуруҳ ўнгда (0° атрофида),
    улар йўлида — «Рақамли ҳукумат» дуга-шлюзи. */
function layoutLevel(focus: EcoNode): LevelLayout {
  const all = focus.children ?? []
  // «Рақамли ҳукумат» ҳалқада турмайди — у дуга-шлюз бўлади
  const gateNode = all.find((n) => n.id === 'ag-rh') ?? null
  const rest = all.filter((n) => n !== gateNode)
  const viaKids = rest.filter((n) => viaCountOf(n) > 0)
  const dirKids = rest.filter((n) => viaCountOf(n) === 0)
  const hasGate = Boolean(gateNode) || viaKids.length > 0
  const kids = hasGate ? [...viaKids, ...dirKids] : rest
  const c = kids.length
  const rx = c <= 3 ? 300 : c <= 4 ? 350 : c <= 5 ? 405 : c <= 6 ? 450 : c <= 8 ? 495 : c <= 12 ? 512 : c <= 18 ? 520 : 526
  const ry = c <= 3 ? 168 : c <= 4 ? 192 : c <= 5 ? 216 : c <= 6 ? 236 : c <= 8 ? 252 : c <= 12 ? 262 : c <= 18 ? 268 : 274
  // катта ҳалқаларда тугунлар ихчамроқ (26 тагача сиғади)
  const baseR = c <= 8 ? 34 : kids.some((n) => n.icon) ? 28 : c <= 12 ? 26 : c <= 18 ? 24 : 21
  const step = 360 / Math.max(c, 1)
  const nVia = viaKids.length
  // via-блок марказлашган ўнгда (0°); шлюзсиз даража — аввалгидек
  const start = hasGate && nVia > 0 ? -((nVia - 1) * step) / 2 : c === 2 ? 0 : -90
  const k = c <= 8 ? 0.08 : 0.05
  // дуга-шлюз радиуслари (ядро ва ҳалқа орасида)
  const gate = { x: rx * 0.55, y: ry * Math.max(0.58, 120 / ry) }
  const gatePoint = (deg: number) => {
    const t = (deg * Math.PI) / 180
    return { x: CX + gate.x * Math.cos(t), y: CY + gate.y * Math.sin(t) }
  }
  // вес тугуна = интеграциялар сони: кўп интеграцияли идора йирикроқ ва йўғонроқ чизиқли
  const counts = kids.map((n) => n.children?.length ?? 0)
  const maxCount = Math.max(...counts, 1)
  const weighted = maxCount > 1
  const ring = kids.map((n, i) => {
    const a = ((start + step * i) * Math.PI) / 180
    // 19+ тугунда ҳалқа икки қаватли: жуфтлари ичкарироқ — ёзувлар тиқилмайди
    const st = c > 18 && i % 2 === 0 ? 0.78 : 1
    const x = CX + rx * st * Math.cos(a)
    const y = CY + ry * st * Math.sin(a)
    const w = weighted ? (counts[i] / maxCount) ** 0.55 : 0
    const r = baseR - 2 + w * 13
    const isVia = hasGate && i < nVia
    let edge: string
    let port: { x: number; y: number } | null = null
    if (isVia) {
      // via-линия прямая — пересекает дугу-шлюз точно в порту
      edge = `M${x.toFixed(1)},${y.toFixed(1)} L${CX},${CY}`
      const dx = x - CX
      const dy = y - CY
      const tau = 1 / Math.sqrt((dx / gate.x) ** 2 + (dy / gate.y) ** 2)
      port = { x: CX + dx * tau, y: CY + dy * tau }
    } else {
      const mx = (x + CX) / 2 + (CY - y) * k
      const my = (y + CY) / 2 + (x - CX) * k
      edge = `M${x.toFixed(1)},${y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${CX},${CY}`
    }
    return { n, x, y, r, ew: 1 + w * 3.2, edge, isVia, port, pulseDur: 2.4 + (i % 4) * 0.45 }
  })
  let gateL: GateLayout | null = null
  if (hasGate) {
    const padDeg = Math.min(14, Math.max(6, step * 0.4))
    const s0 = nVia > 0 ? start : 0
    const s1 = nVia > 0 ? start + step * (nVia - 1) : 0
    const P0 = gatePoint(s0 - padDeg)
    const P1 = gatePoint(s1 + padDeg)
    const large = s1 - s0 + 2 * padDeg > 180 ? 1 : 0
    // медальон — в свободном промежутке между портами: при нечётном числе
    // via-узлов средний порт стоит на 0°, сдвигаемся на полшага; при
    // единственном узле остаёмся на 0° — линия проходит сквозь медальон
    const m = gatePoint(nVia % 2 === 1 && nVia > 1 ? step / 2 : 0)
    gateL = {
      n: gateNode,
      arc: `M${P0.x.toFixed(1)},${P0.y.toFixed(1)} A${gate.x.toFixed(1)},${gate.y.toFixed(1)} 0 ${large} 1 ${P1.x.toFixed(1)},${P1.y.toFixed(1)}`,
      mx: m.x,
      my: m.y,
      mr: gateNode ? 27 : 20,
      count: gateNode?.children?.length ?? 0,
    }
  }
  return { ring, gate: gateL }
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
  const { ring, gate } = useMemo(() => layoutLevel(focus), [focus])

  // корневой узел платформы участвует в hover/tooltip как псевдо-узел на медальоне
  const gateAsNode: NodeLayout | null =
    gate && gate.n
      ? { n: gate.n, x: gate.mx, y: gate.my, r: gate.mr, ew: 0, edge: '', isVia: false, port: null, pulseDur: 3 }
      : null
  const hoverNodes = gateAsNode ? [...ring, gateAsNode] : ring
  const gateId = gate?.n?.id ?? null

  const hoveredL = hover && hover !== 'core' ? hoverNodes.find((l) => l.n.id === hover) : null

  const stateOf = (id: string) => {
    if (!hover) return ''
    if (hover === 'core') return s.rel
    return id === hover ? s.hot : s.dim
  }
  // шлюз «соотносится» с наведённым via-узлом (его данные проходят сквозь дугу)
  const gateState = !hover
    ? ''
    : hover === 'core'
      ? s.rel
      : gateId && hover === gateId
        ? s.hot
        : hoverNodes.find((l) => l.n.id === hover)?.isVia
          ? s.rel
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
        aria-label={`Интеграция харитаси, даража: ${focus.name}. Марказ атрофида ${hoverNodes.length} та тугун`}
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

          {/* алоқалар + маълумот пульслари (режадагилар — пунктир, пульссиз) */}
          {ring.map((l, i) => (
            <g
              key={l.n.id}
              className={`${s.edgeGroup} ${l.n.status === 'plan' && !l.n.children?.length ? s.edgePlan : ''} ${stateOf(l.n.id)}`}
              style={{ '--ew': `${l.ew.toFixed(1)}px` } as React.CSSProperties}
            >
              {/* via-линия — синяя на белой подложке, прямая сквозь дугу-шлюз */}
              {l.isVia && !(l.n.status === 'plan' && !l.n.children?.length) && (
                <path className={s.edgeCasing} d={l.edge} />
              )}
              <path id={`edge-${l.n.id}`} className={l.isVia ? s.edgeVia : s.edge} d={l.edge} />
              <g className={s.pulses}>
                {/* Барг даражасида: барг доирасида ССВ тизими белгиси, марказда — идора.
                    out (ССВ → идора): барг → марказ; in (идора → ССВ): марказ → барг.
                    dir йўқ (илдиз: идоралар, э-рецепт ҳамкорлари) — оқим марказдан
                    ташқарига: ССВдан чиқаётган маълумот. */}
                {[0, 1].map((j) => (
                  <circle key={j} className={l.isVia ? s.pulseDotVia : s.pulseDot} r={l.r > 30 ? 3.1 : 2.6}>
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
              </g>
            </g>
          ))}

          {/* дуга-шлюз «Рақамли ҳукумат» — на пути via-линий */}
          {gate && (
            <g
              className={`${s.gate} ${gateState}`}
              {...(gate.n
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `${gate.n.name}. ${gate.n.desc} Ичида ${gate.count} та йўналиш.`,
                    onMouseEnter: () => setHover(gate.n!.id),
                    onMouseLeave: () => setHover(null),
                    onFocus: () => setHover(gate.n!.id),
                    onBlur: () => setHover(null),
                    onClick: () => drill(gateAsNode!),
                    onKeyDown: activate(() => drill(gateAsNode!)),
                  }
                : { 'aria-hidden': true as const })}
            >
              <path className={s.gateArcCasing} d={gate.arc} />
              <path className={s.gateArc} d={gate.arc} />
            </g>
          )}

          {/* порты — точки пересечения via-линий с дугой (поверх дуги) */}
          {ring
            .filter((l) => l.port)
            .map((l) => (
              <circle
                key={`port-${l.n.id}`}
                className={`${s.gatePort} ${stateOf(l.n.id)}`}
                cx={l.port!.x.toFixed(1)}
                cy={l.port!.y.toFixed(1)}
                r={gate?.n ? 4.5 : 3.4}
              />
            ))}

          {/* медальон шлюза: логотип, бейдж, подпись */}
          {gate && (
            <g
              className={`${s.gateMed} ${gateState}`}
              transform={`translate(${gate.mx.toFixed(1)}, ${gate.my.toFixed(1)})`}
              {...(gate.n
                ? {
                    role: 'button',
                    tabIndex: -1,
                    onMouseEnter: () => setHover(gate.n!.id),
                    onMouseLeave: () => setHover(null),
                    onClick: () => drill(gateAsNode!),
                  }
                : {})}
            >
              <circle className={s.gateMedallion} r={gate.mr} />
              <g transform={`translate(${-gate.mr * 0.56}, ${-gate.mr * 0.56})`}>
                <AgencyLogoSvg id="rh" size={gate.mr * 1.12} />
              </g>
              {gate.n && gate.count > 0 && (
                <g transform={`translate(${gate.mr * 0.74}, ${-gate.mr * 0.74})`}>
                  <circle className={s.nodeBadge} r="10.5" />
                  <text className={s.nodeBadgeText} textAnchor="middle" dy="3.5">
                    {gate.count}
                  </text>
                </g>
              )}
              <text className={s.gateLabel} y={gate.mr + 17} textAnchor="middle">
                «Рақамли ҳукумат»
              </text>
              <text className={s.gateLabelSub} y={gate.mr + 31} textAnchor="middle">
                интеграция платформаси
              </text>
            </g>
          )}

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

          {/* даража тугунлари */}
          {ring.map((l) => (
            <g
              key={l.n.id}
              className={`${s.node} ${l.r < 28 ? s.nodeSm : ''} ${l.r < 24 ? s.nodeXs : ''} ${l.n.status === 'plan' && !l.n.children?.length ? s.nodePlan : ''} ${stateOf(l.n.id)}`}
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

      {/* легенда типов линий — плашка в левом нижнем углу карты */}
      {gate && (
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
