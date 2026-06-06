"use client"

import { useEffect, useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

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

const belt = [...testimonials, ...testimonials]

function Card({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div
      className="
        relative flex-none w-[320px] rounded-2xl border border-border bg-card
        px-7 pt-7 pb-6 overflow-hidden
        hover:border-amber-700/30 transition-colors duration-300
      "
    >
      <span
        aria-hidden
        className="
          pointer-events-none absolute right-4 top-1
          font-serif italic text-[4.5rem] leading-none
          text-border select-none
        "
      >
        "
      </span>

      <p className="mb-4 text-amber-500 text-xs tracking-widest select-none">
        {"★".repeat(t.rating)}
      </p>

      <blockquote className="font-serif italic text-sm leading-[1.8] text-foreground mb-6">
        "{t.content}"
      </blockquote>

      <hr className="border-border mb-4" />

      <div className="flex items-center gap-3">
        <div
          className="
            h-9 w-9 shrink-0 rounded-full
            bg-amber-50 dark:bg-amber-950/30
            border border-amber-700/20
            flex items-center justify-center
            font-serif text-xs font-semibold text-amber-800 dark:text-amber-400
          "
        >
          {t.initials}
        </div>
        <div>
          <p className="text-[13px] font-medium text-foreground">{t.name}</p>
          <p className="text-[11px] font-light text-muted-foreground mt-0.5">{t.device}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.2 })
  const beltRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number | null>(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const el = beltRef.current
    if (!el) return

    // Velocidade em px por frame (~60fps → ~1.0 = suave)
    const speed = 0.7

    function getHalfWidth() {
      return el!.scrollWidth / 2
    }

    function tick() {
      if (!pausedRef.current) {
        posRef.current += speed

        // Quando chegou na metade (segunda cópia), volta pro zero sem salto
        if (posRef.current >= getHalfWidth()) {
          posRef.current = 0
        }

        el!.style.transform = `translateX(-${posRef.current}px)`
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  function handleMouseEnter() {
    pausedRef.current = true
  }

  function handleMouseLeave() {
    pausedRef.current = false
  }

  return (
    <section id="depoimentos" className="py-20 sm:py-28 overflow-hidden bg-background">

      {/* Header */}
      <div
        ref={headerRef}
        className={`
          text-center mb-12 px-4
          transition-all duration-700
          ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-7 bg-emerald-700/50" />
          <p className="text-[11px] tracking-[0.18em] uppercase text-emerald-700 font-normal">
            Depoimentos
          </p>
          <span className="h-px w-7 bg-emerald-700/50" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.4rem] font-semibold text-foreground leading-tight">
          O que nossos{" "}
          <em
            className="text-emerald-700 font-semibold"
            style={{ fontStyle: "italic" }}
          >
            clientes
          </em>{" "}
          dizem
        </h2>
      </div>

      {/* Belt */}
      <div
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade nas bordas */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Fita rolante */}
        <div
          ref={beltRef}
          className="flex gap-5 w-max pb-2 will-change-transform"
        >
          {belt.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}