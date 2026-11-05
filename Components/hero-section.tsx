"use client"

import "./hero-section.css"
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown, Shield, Clock, Award, Zap, Wrench } from "lucide-react"

const TRUST = [
  { icon: Shield, label: "Garantia 90 dias" },
  { icon: Clock, label: "Atendimento rápido" },
  { icon: Award, label: "Peças originais" },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const spotRaf = useRef(0)
  const tiltRaf = useRef(0)

  /* ---------- Parallax de scroll + visibilidade (pausa animações fora da tela) ---------- */
  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return

    let visible = true
    let raf = 0

    const update = () => {
      raf = 0
      const p = Math.min(Math.max(window.scrollY / sec.offsetHeight, 0), 1)
      sec.style.setProperty("--p", p.toFixed(3))
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }

    /* data-live direto no DOM: sem re-render */
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sec.dataset.live = String(e.isIntersecting)
    })
    io.observe(sec)
    window.addEventListener("scroll", onScroll, { passive: true })
    update()

    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  /* teardown dos rAFs dos ponteiros */
  useEffect(
    () => () => {
      cancelAnimationFrame(spotRaf.current)
      cancelAnimationFrame(tiltRaf.current)
    },
    []
  )

  /* ---------- Holofote do cursor (1x por frame) ---------- */
  const onSectionMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || spotRaf.current) return
    const { clientX, clientY } = e
    spotRaf.current = requestAnimationFrame(() => {
      spotRaf.current = 0
      const sec = sectionRef.current
      if (!sec) return
      const r = sec.getBoundingClientRect()
      sec.style.setProperty("--mx", `${clientX - r.left}px`)
      sec.style.setProperty("--my", `${clientY - r.top}px`)
    })
  }

  /* ---------- Tilt 3D da foto + reflexo (1x por frame) ---------- */
  const onStageMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || tiltRaf.current) return
    const { clientX, clientY } = e
    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0
      const stage = stageRef.current
      const tilt = tiltRef.current
      const glare = glareRef.current
      if (!stage || !tilt) return
      const r = stage.getBoundingClientRect()
      const nx = (clientX - r.left) / r.width - 0.5
      const ny = (clientY - r.top) / r.height - 0.5
      tilt.style.setProperty("--rx", `${(-ny * 11).toFixed(2)}deg`)
      tilt.style.setProperty("--ry", `${(nx * 14).toFixed(2)}deg`)
      glare?.style.setProperty("--gx", `${(nx + 0.5) * 100}%`)
      glare?.style.setProperty("--gy", `${(ny + 0.5) * 100}%`)
    })
  }
  const onStageLeave = () => {
    cancelAnimationFrame(tiltRaf.current)
    tiltRaf.current = 0
    tiltRef.current?.style.setProperty("--rx", "0deg")
    tiltRef.current?.style.setProperty("--ry", "0deg")
  }

  /* ---------- CTA magnético ---------- */
  const onCtaMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty("--sx", `${x}px`)
    el.style.setProperty("--sy", `${y}px`)
    el.style.setProperty("--tx", `${(x - r.width / 2) * 0.12}px`)
    el.style.setProperty("--ty", `${(y - r.height / 2) * 0.22}px`)
  }
  const onCtaLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--tx", "0px")
    e.currentTarget.style.setProperty("--ty", "0px")
  }

  const d = (n: number) => ({ "--d": n }) as CSSProperties

  return (
    <section
      ref={sectionRef}
      className="jh"
      data-live="true"
      onPointerMove={onSectionMove}
    >
      {/* ───────── FUNDO ───────── */}
      <div className="jh-bg" aria-hidden="true">
        <div className="jh-aurora">
          <i />
          <i />
          <i />
        </div>

        <svg className="jh-traces" viewBox="0 0 520 320" fill="none">
          <path className="base" pathLength={100} d="M0 40 H130 L170 80 H330 L360 50 H520" />
          <path className="pulse" pathLength={100} d="M0 40 H130 L170 80 H330 L360 50 H520" />
          <path className="base" pathLength={100} d="M0 150 H90 L130 190 H260 L290 160 H440" />
          <path className="pulse" pathLength={100} d="M0 150 H90 L130 190 H260 L290 160 H440" />
          <path className="base" pathLength={100} d="M0 260 H170 L210 220 H380" />
          <path className="pulse" pathLength={100} d="M0 260 H170 L210 220 H380" />
          <circle cx="170" cy="80" r="4" />
          <circle cx="130" cy="190" r="4" />
          <circle cx="210" cy="220" r="4" />
          <circle cx="360" cy="50" r="4" />
        </svg>

        <div className="jh-floor">
          <div className="jh-floor__grid" />
        </div>
        <div className="jh-spot" />
      </div>

      {/* ───────── CONTEÚDO ───────── */}
      <div className="jh-wrap">
        {/* COPY */}
        <div className="jh-copy">
          <div className="jh-tag jh-in" style={d(0)}>
            <span className="jh-tag__badge">
              <Wrench /> Assistência
            </span>
            <span className="jh-rotor" aria-label="TVs, Micro-ondas, Todas as marcas">
              <span aria-hidden="true">
                <b>TVs</b>
                <b>Micro-ondas</b>
                <b>Todas as marcas</b>
                <b>TVs</b>
              </span>
            </span>
          </div>

          <h1 className="jh-title">
            <span className="jh-line">
              <span className="jh-word" style={d(0)}>
                Consertamos.
              </span>
            </span>
            <span className="jh-line">
              <span className="jh-word jh-word--grad" style={d(1)}>
                Vendemos.
                <svg className="jh-squig" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M3 11 Q 40 1 80 10 T 160 10 T 240 10 T 297 8" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="jh-lead jh-in" style={d(5)}>
            Manutenção especializada em <strong>TVs e micro-ondas</strong> com peças
            originais, <strong>garantia real</strong> e atendimento que respeita o seu
            tempo.
          </p>

          <div className="jh-ctas jh-in" style={d(6)}>
            <Link
              href="#orcamento-form"
              className="jh-cta"
              onPointerMove={onCtaMove}
              onPointerLeave={onCtaLeave}
            >
              <Zap />
              <span>Solicitar orçamento grátis</span>
              <ArrowRight />
            </Link>
            <Link href="#servicos" className="jh-ghost">
              Ver serviços
              <ChevronDown />
            </Link>
          </div>

          <div className="jh-pills jh-in" style={d(7)}>
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="jh-pill">
                <i>
                  <Icon />
                </i>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL */}
        <div
          ref={stageRef}
          className="jh-stage jh-in"
          style={d(3)}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div ref={tiltRef} className="jh-tilt">
            <div className="jh-frame">
              <div className="jh-photo">
                <Image
                  src="/office_loja.png"
                  alt="Interior da loja — TVs e micro-ondas"
                  fill
                  priority
                  quality={90}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />

                <span className="jh-corner jh-corner--tl" aria-hidden="true" />
                <span className="jh-corner jh-corner--tr" aria-hidden="true" />
                <span className="jh-corner jh-corner--bl" aria-hidden="true" />
                <span className="jh-corner jh-corner--br" aria-hidden="true" />

                <div className="jh-hud" aria-hidden="true">
                  <span className="jh-dot" /> Diagnóstico ativo
                </div>

                <ul className="jh-stats">
                  <li>
                    <b>98%</b>
                    <span>clientes satisfeitos</span>
                  </li>
                  <li>
                    <b>+5000</b>
                    <span>reparos</span>
                  </li>
                </ul>

                <div className="jh-caption">
                  <small>Nossa loja</small>
                  <p>Atendimento presencial e técnico</p>
                </div>

                <div ref={glareRef} className="jh-glare" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}