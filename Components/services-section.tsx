"use client"

import "./services-section.css"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react"
import {
  Tv,
  Microwave,
  Wrench,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Zap,
  type LucideIcon,
} from "lucide-react"

/* ═══════════════════════════════════════════
   DADOS
═══════════════════════════════════════════ */
type Art = "tv" | "micro"

const repairServices = [
  {
    icon: Tv,
    art: "tv" as Art,
    title: "Manutenção de TVs",
    description:
      "Reparo completo em TVs LED, LCD, OLED e QLED de todas as marcas. Diagnóstico preciso, peças originais e serviço com garantia.",
    features: ["Todas as marcas", "Peças originais", "Garantia 90 dias"],
    stat: "+500",
    statLabel: "TVs reparadas",
  },
  {
    icon: Microwave,
    art: "micro" as Art,
    title: "Manutenção de Micro-ondas",
    description:
      "Conserto especializado em magnetron, transformador, placa e painel. Atendemos todas as marcas com agilidade.",
    features: ["Todas as marcas", "Diagnóstico rápido", "Orçamento grátis"],
    stat: "+300",
    statLabel: "Micro-ondas consertados",
  },
]

const salesServices = [
  {
    icon: Tv,
    art: "tv" as Art,
    title: "Venda de TVs",
    description:
      "Smart TVs novas e seminovas das melhores marcas. Todos os aparelhos testados e com garantia inclusa.",
    features: ["Novas e seminovas", "Garantia inclusa", "Melhores preços"],
    badge: "Pronta entrega",
  },
  {
    icon: Microwave,
    art: "micro" as Art,
    title: "Venda de Micro-ondas",
    description:
      "Micro-ondas novos e seminovos revisados com garantia de funcionamento. Estoque variado, pronta entrega.",
    features: ["Novos e seminovos", "Revisados", "Pronta entrega"],
    badge: "Em estoque",
  },
]

/* ═══════════════════════════════════════════
   HOOK: visibilidade (seen = já apareceu | live = está na tela)
═══════════════════════════════════════════ */
function useVisibility<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, seen, live }
}

/* ═══════════════════════════════════════════
   SEÇÃO
═══════════════════════════════════════════ */
export function ServicesSection() {
  const { ref: headRef, seen: headSeen } = useVisibility<HTMLElement>(0.2)
  const style = (d: number) => ({ "--d": d }) as CSSProperties

  return (
    <section id="servicos" className="sv">
      <div className="sv-bg" aria-hidden="true">
        <div className="sv-bg__dots" />
        <i />
        <i />
      </div>

      <div className="sv-wrap">
        {/* HEADER */}
        <header ref={headRef} className="sv-head" data-seen={headSeen}>
          <p className="sv-eyebrow sv-reveal" style={style(0)}>
            <i>
              <Zap aria-hidden />
            </i>
            Nossos Serviços
          </p>

          <div className="sv-head__row">
            <h2 className="sv-title sv-reveal" style={style(1)}>
              Conserto <em>especializado</em>
              <br />e venda <span>com qualidade</span>
            </h2>
            <p className="sv-lead sv-reveal" style={style(2)}>
              Atendemos com agilidade, transparência e garantia em tudo que fazemos.
            </p>
          </div>

          <div className="sv-meta sv-reveal" style={style(3)}>
            <i aria-hidden="true" />
            <span>
              <b>800+</b> equipamentos atendidos
            </span>
          </div>
        </header>

        {/* MANUTENÇÃO */}
        <Group number="01" label="Manutenção" icon={Wrench} tone="repair">
          <ScrollStack>
            {repairServices.map((service, i) => (
              <StackItem key={service.title} index={i}>
                {(seen) => <RepairCard service={service} index={i} seen={seen} />}
              </StackItem>
            ))}
          </ScrollStack>
        </Group>

        {/* VENDAS */}
        <Group number="02" label="Vendas" icon={ShoppingBag} tone="sale">
          <ScrollStack>
            {salesServices.map((service, i) => (
              <StackItem key={service.title} index={i}>
                {() => <SaleCard service={service} index={i} />}
              </StackItem>
            ))}
          </ScrollStack>
        </Group>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   GRUPO
═══════════════════════════════════════════ */
function Group({
  number,
  label,
  icon: Icon,
  tone,
  children,
}: {
  number: string
  label: string
  icon: LucideIcon
  tone: "repair" | "sale"
  children: ReactNode
}) {
  const { ref, seen } = useVisibility<HTMLDivElement>(0.5)
  return (
    <div className={`sv-group sv-tone--${tone}`}>
      <div ref={ref} className="sv-group__head" data-seen={seen}>
        <span>
          {number} — {label}
        </span>
        <i aria-hidden="true" />
        <Icon aria-hidden />
      </div>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════
   PILHA NO SCROLL
   sticky (CSS) + scale/escurecimento (JS leve, 1x por frame,
   só enquanto a pilha está visível). SEM blur.
═══════════════════════════════════════════ */
function ScrollStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const items = Array.from(container.querySelectorAll<HTMLElement>(".sv-item"))
    if (!items.length) return

    let visible = false
    let ticking = false

    const update = () => {
      // 1) leituras
      const metrics = items.map((el) => ({
        top: el.getBoundingClientRect().top,
        stick: parseFloat(getComputedStyle(el).top) || 0,
      }))
      // 2) escritas
      items.forEach((el, i) => {
        const behind = items.length - 1 - i
        const progress = Math.min(Math.max((metrics[i].stick - metrics[i].top) / 220, 0), 1)
        el.style.setProperty("--s", (1 - progress * 0.045 * behind).toFixed(4))
        el.style.setProperty("--dim", (behind > 0 ? progress * 0.55 : 0).toFixed(3))
      })
      ticking = false
    }

    const onScroll = () => {
      if (visible && !ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) onScroll()
      },
      { rootMargin: "20% 0px 20% 0px" }
    )
    io.observe(container)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()

    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="sv-stack">
      {children}
    </div>
  )
}

function StackItem({
  index,
  children,
}: {
  index: number
  children: (seen: boolean) => ReactNode
}) {
  const { ref, seen, live } = useVisibility<HTMLDivElement>(0.12)
  return (
    <div
      ref={ref}
      className="sv-item"
      data-seen={seen}
      data-live={live}
      style={{ "--top": `calc(5.5rem + ${index * 1.1}rem)` } as CSSProperties}
    >
      {children(seen)}
    </div>
  )
}

/* ═══════════════════════════════════════════
   CARDS
═══════════════════════════════════════════ */
function useSpotlight() {
  return (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
}

type RepairService = (typeof repairServices)[number]

function RepairCard({
  service,
  index,
  seen,
}: {
  service: RepairService
  index: number
  seen: boolean
}) {
  const onMove = useSpotlight()
  const countRef = useRef<HTMLElement>(null)
  const target = parseInt(service.stat.replace(/\D/g, ""), 10)

  /* contagem animada, direto no DOM */
  useEffect(() => {
    if (!seen) return
    const el = countRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const start = performance.now() + 500
    const dur = 1800
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(Math.max((t - start) / dur, 0), 1)
      el.textContent = `+${Math.round(target * (1 - Math.pow(1 - k, 3)))}`
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    el.textContent = "+0"
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, target])

  return (
    <div className="sv-tone--repair">
      <article className="sv-card" onPointerMove={onMove}>
        <span className="sv-dim" aria-hidden="true" />

        <div className="sv-body">
          <div className="sv-top">
            <span className="sv-ico">
              <service.icon aria-hidden />
            </span>
            <span className="sv-num">
              <b>{String(index + 1).padStart(2, "0")}</b> / 02
            </span>
          </div>

          <h3 className="sv-card-title">{service.title}</h3>
          <p className="sv-desc">{service.description}</p>

          <ul className="sv-feats">
            {service.features.map((f) => (
              <li key={f} className="sv-feat">
                <CheckCircle aria-hidden />
                {f}
              </li>
            ))}
          </ul>

          <a href="#contato" className="sv-cta">
            <span>Solicitar orçamento grátis</span>
            <ArrowRight aria-hidden />
          </a>
        </div>

        <div className="sv-stage" aria-hidden="true">
          <span className="sv-ring" />
          <span className="sv-bignum">{String(index + 1).padStart(2, "0")}</span>
          <div className="sv-chip sv-chip--stat">
            <b ref={countRef}>{service.stat}</b>
            <span>{service.statLabel}</span>
          </div>
          <div className="sv-artwrap">{service.art === "tv" ? <TvArt /> : <MicroArt />}</div>
        </div>
      </article>
    </div>
  )
}

type SaleService = (typeof salesServices)[number]

function SaleCard({ service, index }: { service: SaleService; index: number }) {
  const onMove = useSpotlight()
  return (
    <div className="sv-tone--sale">
      <article className="sv-card" onPointerMove={onMove}>
        <span className="sv-dim" aria-hidden="true" />

        <div className="sv-body">
          <div className="sv-top">
            <span className="sv-ico">
              <service.icon aria-hidden />
            </span>
            <span className="sv-num">
              <b>{String(index + 1).padStart(2, "0")}</b> / 02
            </span>
          </div>

          <h3 className="sv-card-title">{service.title}</h3>
          <p className="sv-desc">{service.description}</p>

          <ul className="sv-feats">
            {service.features.map((f) => (
              <li key={f} className="sv-feat">
                <CheckCircle aria-hidden />
                {f}
              </li>
            ))}
          </ul>

          <a href="#contato" className="sv-cta">
            <span>Ver disponibilidade</span>
            <ArrowRight aria-hidden />
          </a>
        </div>

        <div className="sv-stage" aria-hidden="true">
          <span className="sv-ring" />
          <span className="sv-bignum">{String(index + 1).padStart(2, "0")}</span>
          <div className="sv-chip sv-chip--badge">
            <span className="sv-dot" />
            {service.badge}
          </div>
          <div className="sv-artwrap">{service.art === "tv" ? <TvArt /> : <MicroArt />}</div>
        </div>
      </article>
    </div>
  )
}

/* ═══════════════════════════════════════════
   ILUSTRAÇÕES
═══════════════════════════════════════════ */
function TvArt() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg className="sv-art" viewBox="0 0 320 230" role="img" aria-label="TV">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a6e" />
          <stop offset="42%" stopColor="#b4338f" />
          <stop offset="68%" stopColor="#ff7b3a" />
          <stop offset="86%" stopColor="#ffcb4a" />
        </linearGradient>
        <linearGradient id={`${uid}-gr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c6b4a" />
          <stop offset="100%" stopColor="#0a2a2e" />
        </linearGradient>
        <radialGradient id={`${uid}-sun`}>
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="55%" stopColor="#ffd35c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <rect x="30" y="30" width="260" height="148" rx="8" />
        </clipPath>
      </defs>

      {/* pé */}
      <path className="stand" d="M122 190 L112 212 H208 L198 190Z" />
      <rect className="stand" x="92" y="212" width="136" height="8" rx="4" />

      {/* corpo */}
      <rect className="body" x="18" y="18" width="284" height="172" rx="14" />

      {/* tela */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="30" y="30" width="260" height="148" fill={`url(#${uid}-sky)`} />
        <ellipse className="cloud" cx="40" cy="62" rx="34" ry="7" />
        <ellipse className="cloud" cx="20" cy="86" rx="26" ry="5" />
        <circle className="sun" cx="160" cy="128" r="34" fill={`url(#${uid}-sun)`} />
        <path d="M30 150 Q 90 116 150 142 T 290 134 V178 H30Z" fill={`url(#${uid}-gr)`} />
        <path d="M150 142 Q 162 160 142 178 H192 Q 172 160 176 144Z" fill="#ffb347" opacity="0.45" />
        <rect className="scan" x="30" y="28" width="260" height="4" />
      </g>
      <path className="shine" d="M30 30 H170 L110 178 H30Z" />
      <circle className="led" cx="160" cy="184" r="2.4" />
    </svg>
  )
}

function MicroArt() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg className="sv-art" viewBox="0 0 320 230" role="img" aria-label="Micro-ondas">
      <defs>
        <linearGradient id={`${uid}-win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#141c30" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0%" stopColor="#ffb24a" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ff7a3d" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pés */}
      <rect className="stand" x="34" y="194" width="28" height="9" rx="3" />
      <rect className="stand" x="258" y="194" width="28" height="9" rx="3" />

      {/* corpo */}
      <rect className="body" x="14" y="34" width="292" height="160" rx="18" />

      {/* porta + janela */}
      <rect className="door" x="28" y="48" width="196" height="132" rx="12" />
      <rect className="win" x="42" y="62" width="168" height="104" rx="8" fill={`url(#${uid}-win)`} />
      <ellipse className="glow" cx="126" cy="134" rx="74" ry="34" fill={`url(#${uid}-glow)`} />
      <ellipse className="plate" cx="126" cy="148" rx="54" ry="11" />
      <rect className="cup" x="108" y="120" width="36" height="26" rx="5" />
      <g className="steam">
        <path d="M116 114 q -6 -9 0 -17" />
        <path d="M126 114 q -6 -9 0 -17" />
        <path d="M136 114 q -6 -9 0 -17" />
      </g>
      <path className="shine" d="M42 62 H130 L96 166 H42Z" />

      {/* painel */}
      <rect className="panel" x="236" y="48" width="56" height="132" rx="10" />
      <rect className="disp" x="243" y="56" width="42" height="24" rx="5" />
      <text className="digits" x="264" y="73" textAnchor="middle">
        0<tspan className="colon">:</tspan>30
      </text>
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <circle key={`${r}-${c}`} className="btn" cx={250 + c * 14} cy={98 + r * 15} r="4.2" />
        ))
      )}
      <circle className="start" cx="264" cy="164" r="7" />
      <circle className="led" cx="150" cy="188" r="0" />
    </svg>
  )
}