"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function StatsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  const stats = [
    {
      value: "15+",
      label: "Anos de experiência",
      sublabel: "no mercado",
      index: "01",
    },
    {
      value: "5.000+",
      label: "Reparos realizados",
      sublabel: "com sucesso",
      index: "02",
    },
    {
      value: "98%",
      label: "Clientes satisfeitos",
      sublabel: "comprovados",
      index: "03",
    },
    {
      value: "2 em 1",
      label: "Manutenção + Venda",
      sublabel: "tudo em um só lugar",
      index: "04",
    },
  ]

  return (
    <section ref={ref} className="relative py-0 overflow-hidden bg-background">
      {/* Faixa diagonal decorativa */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {/* Ruído sutil de fundo */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Grid sem gap — as bordas fazem a separação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-border border-y border-border">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} isVisible={isVisible} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Card individual ─────────────────────────────────────── */

type Stat = {
  value: string
  label: string
  sublabel: string
  index: string
}

function StatCard({
  stat,
  isVisible,
  delay,
}: {
  stat: Stat
  isVisible: boolean
  delay: number
}) {
  return (
    <div
      className={`
        relative group px-8 py-12 sm:py-14 overflow-hidden
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Hover fill — sobe de baixo */}
      <div
        className="
          absolute inset-0 bg-primary/[0.04]
          translate-y-full group-hover:translate-y-0
          transition-transform duration-500 ease-out
        "
        aria-hidden="true"
      />

      {/* Accent line topo */}
      <div
        className="
          absolute top-0 left-8 right-8 h-[2px] bg-primary
          scale-x-0 group-hover:scale-x-100 origin-left
          transition-transform duration-500 ease-out
        "
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-4">
        {/* Número de índice discreto */}
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase select-none">
          {stat.index}
        </span>

        {/* Valor principal */}
        <p
          className="
            font-serif font-bold leading-none text-primary
            text-[clamp(2.5rem,5vw,3.75rem)]
            tabular-nums
          "
        >
          {stat.value}
        </p>

        {/* Separador orgânico */}
        <div className="w-8 h-px bg-border group-hover:w-16 group-hover:bg-primary/40 transition-all duration-500" />

        {/* Textos */}
        <div>
          <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
            {stat.label}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {stat.sublabel}
          </p>
        </div>
      </div>
    </div>
  )
}