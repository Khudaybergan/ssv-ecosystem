/* ============================================================
   «Тиббий маълумотлар» қатлами: маълумотларнинг бемордан
   бошқарув қароригача йўли, жонли оқим анимацияси билан.
   ============================================================ */
import { useState } from 'react'
import { useReveal } from '../../lib/hooks'
import { SectionHead } from './SectionHead'
import s from './DataFlow.module.css'

const STAGES = [
  { title: 'Бемор', sub: 'мурожаат, шикоятлар, анамнез' },
  { title: 'Тиббий ташкилот', sub: 'қабул, кўрик, тайинловлар' },
  { title: 'Муассаса АТи', sub: 'электрон тарихга ёзув' },
  { title: 'Ягона платформа', sub: 'тиббий карта, реестрлар, алмашинув' },
  { title: 'Таҳлил ва СИ', sub: 'кўрсаткичлар, прогнозлар, хавфлар' },
  { title: 'Бошқарув қарорлари', sub: 'ресурслар, дастурлар, назорат' },
]

export function DataFlow() {
  const ref = useReveal<HTMLDivElement>(0.1)
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="data" className={`section ${s.data}`}>
      <div className="container">
        <SectionHead
          icon="data"
          eyebrow="Тиббий маълумотлар"
          title="Ҳар бир ёзув бутун тизимга хизмат қилади"
          lead="Маълумотлар бир марта — қабулда киритилади. Сўнг улар ягона контур бўйлаб ҳаракатланади: бемор тиббий картасини, соҳа таҳлилини ва вазирлик қарорларини тўлдиради."
        />

        <div ref={ref} className={s.flowWrap} onMouseLeave={() => setActive(null)}>
          <div className={s.rail} aria-hidden="true">
            <span className={s.railLine} />
            {[0, 1, 2].map((i) => (
              <span key={i} className={s.railDot} style={{ animationDelay: `${i * 1.4}s` }} />
            ))}
          </div>

          <ol className={s.stages}>
            {STAGES.map((st, i) => (
              <li
                key={st.title}
                className={`${s.stage} ${active !== null && active !== i ? s.stageDim : ''} ${active === i ? s.stageHot : ''}`}
                onMouseEnter={() => setActive(i)}
              >
                <span className={s.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.stageTitle}>{st.title}</span>
                <span className={s.stageSub}>{st.sub}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.facts}>
          <div className={s.fact}>
            <b>Бир киритиш — кўп қўлланиш</b>
            <span>шифокор ҳисоботларда маълумотни такрорламайди: статистика автоматик йиғилади</span>
          </div>
          <div className={s.fact}>
            <b>Таҳлил учун шахссизлантириш</b>
            <span>шахсий маълумотлар ҳимояланган, таҳлил контурига агрегатлар боради</span>
          </div>
          <div className={s.fact}>
            <b>HL7 FHIR стандарти</b>
            <span>мамлакат барча тиббий тизимлари учун ягона алмашинув тили</span>
          </div>
        </div>
      </div>
    </section>
  )
}
