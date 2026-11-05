"use client"

import "./expertise-section.css"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"
import Image from "next/image"

/* ═══════════════════════════════════════════
   ÍCONES (SVG inline, traço único)
═══════════════════════════════════════════ */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const IconRepair = () => (
  <Icon>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
  </Icon>
)
const IconSale = () => (
  <Icon>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
)
const IconKnowledge = () => (
  <Icon>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </Icon>
)
const IconCare = () => (
  <Icon>
    <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 6.8M18 14.5c2 .6 3.5 2.4 3.5 5.5" />
  </Icon>
)

/* ═══════════════════════════════════════════
   DADOS
═══════════════════════════════════════════ */
const expertiseItems = [
  {
    icon: IconRepair,
    title: "Reparo Especializado",
    description:
      "Consertamos TVs e micro-ondas de todas as marcas com peças originais e garantia.",
  },
  {
    icon: IconSale,
    title: "Venda de Qualidade",
    description:
      "Vendemos aparelhos novos e seminovos revisados, todos com garantia de funcionamento.",
  },
  {
    icon: IconKnowledge,
    title: "Conhecimento Técnico",
    description:
      "Nossa equipe está sempre atualizada com as últimas tecnologias do mercado.",
  },
  {
    icon: IconCare,
    title: "Atendimento Personalizado",
    description:
      "Cada cliente é único. Oferecemos soluções personalizadas para cada necessidade.",
  },
]

const certifications = [
  "Especialista em Smart TVs",
  "Técnico em Micro-ondas",
  "Peças Originais",
  "Garantia em Todos Serviços",
]

/** Tempo (ms) que cada item fica aberto no modo automático */
const AUTOPLAY_MS = 6000

const delay = (n: number) => ({ "--d": n }) as CSSProperties

/* ═══════════════════════════════════════════
   SEÇÃO
═══════════════════════════════════════════ */
export function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const sealId = useId().replace(/:/g, "")

  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)

  /* visibilidade: entrada (uma vez) + pausa fora da tela */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* parallax da foto: só mouse, variáveis CSS, no máx. 1x por frame, zero re-render */
  const onMediaMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || rafRef.current) return
    const { clientX, clientY } = e
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const el = mediaRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty("--px", ((clientX - r.left) / r.width - 0.5).toFixed(3))
      el.style.setProperty("--py", ((clientY - r.top) / r.height - 0.5).toFixed(3))
    })
  }
  const onMediaLeave = () => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    mediaRef.current?.style.setProperty("--px", "0")
    mediaRef.current?.style.setProperty("--py", "0")
  }
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  /* o fim da barra de progresso avança para o próximo item
     (pausar = animation-play-state, então nunca dessincroniza) */
  const onProgressEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return
    setActive((a) => (a + 1) % expertiseItems.length)
  }

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="ex"
      data-seen={seen}
      data-live={live}
    >
      <div className="ex-wrap">
        <div className="ex-grid">
          {/* ───────── IMAGEM ───────── */}
          <div
            ref={mediaRef}
            className="ex-media"
            onPointerMove={onMediaMove}
            onPointerLeave={onMediaLeave}
          >
            <span className="ex-frame ex-frame--a" aria-hidden="true" />
            <span className="ex-frame ex-frame--b" aria-hidden="true" />

            <div className="ex-photo">
              <Image
                src="/Loja_exterior.png"
                alt="Fachada da loja e oficina equipada"
                fill
                sizes="(min-width: 1024px) 560px, 92vw"
              />

              <div className="ex-cap">
                <b>Oficina equipada</b>
                <span>Atendimento presencial e técnico</span>
              </div>
            </div>

            <div className="ex-chip" aria-hidden="true">
              <i>
                <IconRepair />
              </i>
              <div>
                <b>Referência na região</b>
                <span>TVs e micro-ondas</span>
              </div>
            </div>

            {/* Selo: 15+ anos */}
            <div className="ex-seal" role="img" aria-label="15 anos de experiência">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path
                    id={`${sealId}-circle`}
                    d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                  />
                </defs>
                <circle className="disc" cx="60" cy="60" r="58" />
                <g className="ring">
                  <text>
                    <textPath
                      href={`#${sealId}-circle`}
                      textLength="276"
                      lengthAdjust="spacing"
                    >
                      Eletrônica Joana Dark • Assistência Técnica • Todas as marcas •
                    </textPath>
                  </text>
                </g>
                <text className="num" x="60" y="66" textAnchor="middle">
                  15+
                </text>
                <text className="yrs" x="60" y="80" textAnchor="middle">
                  ANOS
                </text>
              </svg>
            </div>
          </div>

          {/* ───────── CONTEÚDO ───────── */}
          <div className="ex-content">
            <p className="ex-eyebrow ex-rv" style={delay(0)}>
              <span className="ex-dot" aria-hidden="true" />
              Por que nos escolher
            </p>

            <h2 className="ex-title ex-rv" style={delay(1)}>
              Expertise que faz a <em>diferença</em>
            </h2>

            <p className="ex-lead ex-rv" style={delay(2)}>
              A <strong>Eletrônica Joana Dark</strong> é referência em manutenção de TVs e
              micro-ondas na região. Além dos reparos, também trabalhamos com venda de
              aparelhos novos e seminovos, oferecendo as melhores opções para nossos
              clientes.
            </p>

            {/* Acordeão com troca automática */}
            <ul
              className="ex-list ex-rv"
              style={{ ...delay(3), "--dur": `${AUTOPLAY_MS}ms` } as CSSProperties}
              data-paused={hovering || !live}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
              onPointerLeave={() => setHovering(false)}
              onFocus={() => setHovering(true)}
              onBlur={() => setHovering(false)}
            >
              {expertiseItems.map((item, i) => {
                const isActive = i === active
                const Ico = item.icon
                return (
                  <li key={item.title} className="ex-row" data-active={isActive}>
                    <button
                      type="button"
                      id={`ex-btn-${i}`}
                      className="ex-btn"
                      aria-expanded={isActive}
                      aria-controls={`ex-panel-${i}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="ex-ico">
                        <Ico />
                      </span>
                      <span className="ex-row-title">{item.title}</span>
                      <span className="ex-plus" aria-hidden="true" />
                    </button>

                    <div
                      className="ex-panel"
                      id={`ex-panel-${i}`}
                      role="region"
                      aria-labelledby={`ex-btn-${i}`}
                      inert={!isActive}
                    >
                      <div>
                        <p>{item.description}</p>
                      </div>
                    </div>

                    <div className="ex-prog" aria-hidden="true">
                      <i onAnimationEnd={isActive ? onProgressEnd : undefined} />
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Diferenciais */}
            <div className="ex-rv" style={delay(4)}>
              <p className="ex-diff__title">Nossos Diferenciais</p>
              <ul className="ex-diff__grid">
                {certifications.map((cert, k) => (
                  <li
                    key={cert}
                    className="ex-diff__item"
                    style={{ "--k": k } as CSSProperties}
                  >
                    <svg className="ex-check" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M7.5 12.5 L10.5 15.5 L16.5 9" />
                    </svg>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}