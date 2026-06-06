"use client"

import { Tv, Microwave, Wrench, ShoppingBag, ArrowRight, CheckCircle, Zap } from "lucide-react"
import { useEffect, useRef } from "react"

const repairServices = [
  {
    icon: Tv,
    title: "Manutenção de TVs",
    description: "Reparo completo em TVs LED, LCD, OLED e QLED de todas as marcas. Diagnóstico preciso, peças originais e serviço com garantia.",
    features: ["Todas as marcas", "Peças originais", "Garantia 90 dias"],
    stat: "+500",
    statLabel: "TVs reparadas",
  },
  {
    icon: Microwave,
    title: "Manutenção de Micro-ondas",
    description: "Conserto especializado em magnetron, transformador, placa e painel. Atendemos todas as marcas com agilidade.",
    features: ["Todas as marcas", "Diagnóstico rápido", "Orçamento grátis"],
    stat: "+300",
    statLabel: "Micro-ondas consertados",
  },
]

const salesServices = [
  {
    icon: Tv,
    title: "Venda de TVs",
    description: "Smart TVs novas e seminovas das melhores marcas. Todos os aparelhos testados e com garantia inclusa.",
    features: ["Novas e seminovas", "Garantia inclusa", "Melhores preços"],
    badge: "Pronta entrega",
  },
  {
    icon: Microwave,
    title: "Venda de Micro-ondas",
    description: "Micro-ondas novos e seminovos revisados com garantia de funcionamento. Estoque variado, pronta entrega.",
    features: ["Novos e seminovos", "Revisados", "Pronta entrega"],
    badge: "Em estoque",
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="relative bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px" }} />
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px] translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">

        {/* HEADER */}
        <header className="mb-16 sm:mb-20">
          <p className="inline-flex items-center gap-2 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Zap className="w-3.5 h-3.5" aria-hidden />
            Nossos Serviços
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-foreground max-w-2xl">
              Conserto <em className="not-italic text-primary">especializado</em>
              <br />e venda <span className="text-foreground/40">com qualidade</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xs lg:pb-2">
              Atendemos com agilidade, transparência e garantia em tudo que fazemos.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">800+ equipamentos atendidos</span>
          </div>
        </header>

        {/* MANUTENÇÃO */}
        <div className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">01 — Manutenção</span>
            <div className="flex-1 h-px bg-border" />
            <Wrench className="w-4 h-4 text-muted-foreground/50 shrink-0" aria-hidden />
          </div>
          <ScrollStack>
            {repairServices.map((service, i) => (
              <StackCard key={i} index={i}>
                <RepairCard service={service} index={i} />
              </StackCard>
            ))}
          </ScrollStack>
        </div>

        {/* VENDAS */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground">02 — Vendas</span>
            <div className="flex-1 h-px bg-border" />
            <ShoppingBag className="w-4 h-4 text-muted-foreground/50 shrink-0" aria-hidden />
          </div>
          <ScrollStack>
            {salesServices.map((service, i) => (
              <StackCard key={i} index={i}>
                <SaleCard service={service} />
              </StackCard>
            ))}
          </ScrollStack>
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SCROLL STACK — sticky CSS + scale JS leve
═══════════════════════════════════════════ */
function ScrollStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const cards = Array.from(container.querySelectorAll<HTMLElement>(".stack-card"))

    function onScroll() {
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const stickyTop = parseInt(card.style.top || "0")

        // Quanto o card já passou do ponto de grudamento
        const stuck = stickyTop - rect.top
        const progress = Math.max(0, Math.min(1, stuck / 200))

        const scale = 1 - progress * 0.04 * (cards.length - 1 - i)
        const blur = progress * 1.5 * (cards.length - 1 - i)

        card.style.transform = `scale(${scale})`
        card.style.filter = blur > 0.1 ? `blur(${blur}px)` : ""
        card.style.transformOrigin = "top center"
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={ref} className="flex flex-col">
      {children}
    </div>
  )
}

function StackCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div
      className="stack-card sticky mb-6 last:mb-0"
      style={{ top: `${88 + index * 20}px` }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════
   CARDS DE CONTEÚDO
═══════════════════════════════════════════ */
type RepairService = (typeof repairServices)[number]

function RepairCard({ service, index }: { service: RepairService; index: number }) {
  return (
    <div className="group relative bg-background border border-border rounded-3xl overflow-hidden hover:border-primary/40 transition-colors duration-300 shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-8 sm:p-10 lg:p-12">
        <span aria-hidden className="absolute top-6 right-8 text-[80px] sm:text-[100px] font-black leading-none text-foreground/[0.03] select-none pointer-events-none tabular-nums overflow-hidden">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="grid sm:grid-cols-[auto_1fr] gap-8 mb-10">
          <service.icon className="w-9 h-9 text-primary" strokeWidth={1.5} aria-hidden />
          <div className="sm:text-right">
            <p className="text-6xl sm:text-7xl font-black tabular-nums text-foreground leading-none mb-2">{service.stat}</p>
            <p className="text-xs text-muted-foreground tracking-wide uppercase">{service.statLabel}</p>
          </div>
        </div>
        <div className="w-12 h-px bg-border mb-8" />
        <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{service.title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl">{service.description}</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {service.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-sm text-foreground/80">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>
        <a href="#contato" className="group/cta inline-flex items-center gap-2.5 text-base font-semibold text-primary">
          <span className="relative">
            Solicitar orçamento grátis
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover/cta:w-full transition-all duration-300" />
          </span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden />
        </a>
      </div>
    </div>
  )
}

type SaleService = (typeof salesServices)[number]

function SaleCard({ service }: { service: SaleService }) {
  return (
    <div className="group relative bg-background border border-accent/30 rounded-3xl overflow-hidden hover:border-accent/60 transition-colors duration-300 shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
      <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-8 sm:p-10 lg:p-12">
        <div className="flex items-start justify-between mb-8">
          <service.icon className="w-9 h-9 text-accent" strokeWidth={1.5} aria-hidden />
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent border-b-2 border-accent/50 pb-1">{service.badge}</span>
        </div>
        <div className="w-12 h-px bg-border mb-8" />
        <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">{service.title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl">{service.description}</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {service.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-sm text-foreground/80">
              <CheckCircle className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>
        <a href="#contato" className="group/cta inline-flex items-center gap-2.5 text-base font-semibold text-accent">
          <span className="relative">
            Ver disponibilidade
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover/cta:w-full transition-all duration-300" />
          </span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden />
        </a>
      </div>
    </div>
  )
}
