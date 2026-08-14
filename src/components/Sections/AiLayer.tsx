/* ============================================================
   Сунъий интеллект — экотизим устидаги интеллектуал қатлам:
   уч текислик (маълумотлар → моделлар → қарорлар) ва қўллаш
   йўналишлари. Роботсиз — фақат мазмун.
   ============================================================ */
import { useReveal } from '../../lib/hooks'
import { SectionHead } from './SectionHead'
import s from './AiLayer.module.css'

const CAPABILITIES = [
  { title: 'Тиббий тасвирлар таҳлили', sub: 'флюорография, маммография, КТ — шифокор учун иккинчи фикр', status: 'пилот' },
  { title: 'Юкламани прогнозлаш', sub: 'мавсумий чўққилар, ҳудудлар бўйича ўрин ва кадрлар режаси', status: 'ишлайди' },
  { title: 'Хавф гуруҳларини аниқлаш', sub: 'сурункали касалликлар бўйича эрта сигналлар', status: 'пилот' },
  { title: 'Клиник қарорларни қўллаб-қувватлаш', sub: 'тайинлов пайтида протоколлар бўйича тавсиялар', status: 'пилот' },
  { title: 'Тиббий ҳужжатларни қайта ишлаш', sub: 'матн ва хулосаларни структуралаш (NLP)', status: 'режа' },
  { title: 'Маълумотлар сифати назорати', sub: 'платформа оқимларида аномалия ва такрорларни аниқлаш', status: 'ишлайди' },
]

export function AiLayer() {
  const ref = useReveal<HTMLDivElement>(0.1)
  return (
    <section id="ai" className={`section ${s.ai}`}>
      <div className="container">
        <div className={s.grid}>
          <div>
            <SectionHead
              icon="ai"
              eyebrow="Сунъий интеллект"
              title="Бутун экотизимнинг интеллектуал қатлами"
              lead="Бу ерда СИ — алоҳида маҳсулот эмас, платформа маълумотлари устида ишлайдиган қатлам: қабулда шифокорга, режалаштиришда вазирликка ёрдам беради."
            />
            <ul className={s.principles}>
              <li>Қарор ҳар доим шифокорда қолади — моделлар тавсия ва асос беради</li>
              <li>Моделлар платформанинг шахссизлантирилган маълумотларида ўқитилади</li>
              <li>Ҳар бир хулоса кузатувчан: манба, модель версияси, сана</li>
            </ul>
          </div>

          {/* три плоскости интеллектуального слоя */}
          <div ref={ref} className={s.planes} aria-label="Қатламлар: маълумотлар, моделлар, қарорлар">
            <div className={`${s.plane} ${s.planeTop}`}>
              <b>Қарорлар</b>
              <span>шифокорга тавсиялар · вазирликка сигналлар</span>
            </div>
            <div className={s.planeLink} aria-hidden="true" />
            <div className={`${s.plane} ${s.planeMid}`}>
              <b>Моделлар</b>
              <span>прогноз · скрининг · NLP · аномалиялар</span>
            </div>
            <div className={s.planeLink} aria-hidden="true" />
            <div className={`${s.plane} ${s.planeBase}`}>
              <b>Экотизим маълумотлари</b>
              <span>36,8 млн тиббий карта · йилига 214 млн ёзув</span>
            </div>
          </div>
        </div>

        <div className={s.caps}>
          {CAPABILITIES.map((c) => (
            <div key={c.title} className={s.cap}>
              <span className={`${s.capStatus} ${c.status === 'ишлайди' ? s.stLive : c.status === 'пилот' ? s.stPilot : s.stPlan}`}>
                {c.status}
              </span>
              <b>{c.title}</b>
              <span className={s.capSub}>{c.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
