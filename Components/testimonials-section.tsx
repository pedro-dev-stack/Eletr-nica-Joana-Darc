"use client"

import "./testimonials-section.css"
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
import { ChevronLeft, ChevronRight, Power } from "lucide-react"

const testimonials = [
  {
    initials: "AC",
    name: "Alcione",
    device: "TV Smart · AOC",
    rating: 5,
    content:
      "Foram maravilhosos — conseguiram dar um jeitinho e nem cobraram o serviço. Super honestos e comprometidos!",
  },
  {
    initials: "EL",
    name: "Eledi",
    device: "Micro-ondas",
    rating: 5,
    content:
      "No final não queriam cobrar… meu marido não aceitou, é claro! Parabéns pelo profissionalismo. Deus os abençoe.",
  },
  {
    initials: "JR",
    name: "Júnior",
    device: "TV Smart",
    rating: 5,
    content:
      "Se quer levar a um lugar de confiança: leve neles! É tão bom encontrar quem trabalha com honestidade.",
  },
  {
    initials: "MA",
    name: "Maria",
    device: 'TV LG 47"',
    rating: 5,
    content:
      "Foram atenciosos e rápidos no diagnóstico. Senti honestidade no atendimento e o preço foi justo. Recomendo.",
  },
]

/** Duração do splash de inicialização / da animação de desligar (ms) */
const BOOT_MS = 1500
const DOWN_MS = 600
const SWIPE_MIN = 48 // px para considerar um swipe

type Phase = "off" | "boot" | "on" | "down"
type Dir = "next" | "prev"

const pad = (n: number) => String(n).padStart(2, "0")

/* média calculada dos dados (formato fixo => sem mismatch de hidratação) */
const AVERAGE = (
  testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
)
  .toFixed(1)
  .replace(".", ",")

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

function Star({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const swipeX = useRef<number | null>(null)
  const userTouched = useRef(false)

  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)
  const [phase, setPhase] = useState<Phase>("off")
  const [touched, setTouched] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState<Dir>("next")
  const [hovering, setHovering] = useState(false)

  const n = testimonials.length
  const t = testimonials[active]
  const isOn = phase === "on"

  const go = (i: number, d: Dir) => {
    setDir(d)
    setActive(((i % n) + n) % n)
  }

  /* visibilidade: entrada (1x) + pausa fora da tela */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* a TV liga sozinha ao chegar na seção (a não ser que o visitante já tenha mexido) */
  useEffect(() => {
    if (!seen) return
    const id = window.setTimeout(() => {
      if (!userTouched.current) {
        setPhase((p) => (p === "off" ? (prefersReducedMotion() ? "on" : "boot") : p))
      }
    }, 700)
    return () => window.clearTimeout(id)
  }, [seen])

  /* boot -> on */
  useEffect(() => {
    if (phase !== "boot") return
    const id = window.setTimeout(() => setPhase("on"), BOOT_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  /* down -> off */
  useEffect(() => {
    if (phase !== "down") return
    const id = window.setTimeout(() => setPhase("off"), DOWN_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  /* botão ligar/desligar */
  const onPower = () => {
    userTouched.current = true
    setTouched(true)
    setPulse((p) => p + 1)
    if (phase === "off") setPhase(prefersReducedMotion() ? "on" : "boot")
    else if (phase === "on" || phase === "boot") setPhase(prefersReducedMotion() ? "off" : "down")
  }

  /* swipe (celular) */
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    swipeX.current = e.clientX
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (swipeX.current === null || !isOn) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (Math.abs(dx) > SWIPE_MIN) go(active + (dx < 0 ? 1 : -1), dx < 0 ? "next" : "prev")
  }

  /* setas do teclado */
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOn) return
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      go(active + 1, "next")
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      go(active - 1, "prev")
    }
  }

  const d = (k: number) => ({ "--d": k }) as CSSProperties
  const showUI = phase === "on" || phase === "down"

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="tm"
      data-seen={seen}
      data-live={live}
    >
      <div className="tm-wrap">
        {/* Header */}
        <header className="tm-head">
          <p className="tm-eyebrow tm-rv" style={d(0)}>
            Depoimentos
          </p>
          <h2 className="tm-title tm-rv" style={d(1)}>
            O que nossos <em>clientes</em> dizem
          </h2>
          <div className="tm-meta tm-rv" style={d(2)}>
            <span className="tm-pill">
              <Star /> <b>{AVERAGE}</b> média
            </span>
            <span className="tm-pill">
              <b>{n}</b> depoimentos
            </span>
          </div>
        </header>

        {/* Todos os depoimentos para leitores de tela (a TV pode estar desligada) */}
        <ul className="tm-sr">
          {testimonials.map((x) => (
            <li key={x.name}>
              {x.name}, {x.device}, {x.rating} de 5 estrelas: {x.content}
            </li>
          ))}
        </ul>

        {/* ───────── A TV ───────── */}
        <div
          className="tm-tv tm-rv"
          style={d(3)}
          data-phase={phase}
          data-touched={touched}
          data-paused={hovering || !live || phase !== "on"}
          onKeyDown={onKey}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          {/* Antena (orelhas de coelho) */}
          <div className="tm-antenna" aria-hidden="true">
            <i className="tm-antenna__rod tm-antenna__rod--l" />
            <i className="tm-antenna__rod tm-antenna__rod--r" />
            <i className="tm-antenna__base" />
          </div>

          <div className="tm-body">
            {/* Tela */}
            <div
              className="tm-screen"
              onPointerDown={onDown}
              onPointerUp={onUp}
              onPointerCancel={() => (swipeX.current = null)}
              role="group"
              aria-hidden="true"
            >
              <div className="tm-panel">
                {phase === "boot" && (
                  <div className="tm-boot">
                    <b>Eletrônica Joana Dark</b>
                    <small>Smart TV · Depoimentos</small>
                    <span className="tm-boot__dots">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                )}

                {showUI && (
                  <>
                    <div className="tm-top">
                      <span>
                        <i className="tm-dot" /> Depoimentos
                      </span>
                      <span>
                        <b>{AVERAGE}</b> ★ · Smart TV
                      </span>
                    </div>

                    <div key={active} className="tm-content" data-dir={dir}>
                      <span className="tm-glyph">“</span>
                      <div className="tm-stars">
                        {Array.from({ length: t.rating }, (_, k) => (
                          <Star key={k} className="tm-star" style={{ "--k": k } as CSSProperties} />
                        ))}
                      </div>
                      <blockquote className="tm-quote">“{t.content}”</blockquote>
                      <div className="tm-author">
                        <span className="tm-avatar">{t.initials}</span>
                        <div>
                          <p className="tm-name">{t.name}</p>
                          <p className="tm-device">{t.device}</p>
                        </div>
                      </div>
                    </div>

                    {/* número do canal (OSD) + piscada de troca */}
                    <div key={`osd-${active}`} className="tm-osd">
                      <b>{pad(active + 1)}</b>
                      <small>{t.name}</small>
                    </div>
                    <span key={`bl-${active}`} className="tm-blink" />
                  </>
                )}
              </div>

              <div className="tm-hint">
                <Power aria-hidden />
                TV desligada · pressione ligar
              </div>
              <span className="tm-glare" />
            </div>

            {/* Queixo: logo, LED e botões físicos */}
            <div className="tm-chin">
              <span className="tm-brand">
                <span className="tm-led" aria-hidden="true" />
                <span>Eletrônica Joana Dark</span>
              </span>

              <div className="tm-keys">
                <div className="tm-dock" role="group" aria-label="Trocar de canal">
                  <button
                    type="button"
                    className="tm-key"
                    onClick={() => go(active - 1, "prev")}
                    disabled={!isOn}
                    aria-label="Canal anterior"
                  >
                    <ChevronLeft aria-hidden />
                  </button>
                  <span className="tm-chlbl" aria-hidden="true">
                    CH <b>{isOn ? pad(active + 1) : "--"}</b>
                  </span>
                  <button
                    type="button"
                    className="tm-key"
                    onClick={() => go(active + 1, "next")}
                    disabled={!isOn}
                    aria-label="Próximo canal"
                  >
                    <ChevronRight aria-hidden />
                  </button>
                </div>

                <div className="tm-dock">
                  <button
                    type="button"
                    className="tm-key tm-power"
                    onClick={onPower}
                    aria-pressed={phase === "on" || phase === "boot"}
                    aria-label={phase === "off" ? "Ligar a TV" : "Desligar a TV"}
                  >
                    <Power aria-hidden />
                    {pulse > 0 && <span key={pulse} className="tm-ripple" aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pés da TV */}
          <div className="tm-feet" aria-hidden="true">
            <i />
            <i />
          </div>
        </div>

        <p className="tm-help tm-rv" style={d(4)}>
          Use os botões da TV, as setas do teclado ou deslize a tela para trocar de canal
        </p>
      </div>
    </section>
  )
}