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

/* ───────── Decoração sazonal do fundo (só aparece na temporada certa, via CSS) ───────── */

/** Black Friday: letreiro neon em movimento */
const BF_PHRASE = "BLACK FRIDAY · OFERTAS · "

/** Liquida de Ano Novo: letreiro em movimento */
const NY_PHRASE = "LIQUIDA · QUEIMA DE ESTOQUE · "

/** Natal: bolas penduradas. Valores fixos => sem mismatch de hidratação. */
const BAUBLES = [
  { x: "9%", len: "4.5rem", size: "2.1rem", color: "var(--s-primary)", dl: "-1.2s" },
  { x: "24%", len: "7.5rem", size: "2.6rem", color: "var(--s-accent)", dl: "-3.1s" },
  { x: "41%", len: "3.5rem", size: "1.8rem", color: "var(--s-highlight)", dl: "-0.4s" },
  { x: "63%", len: "6.5rem", size: "2.4rem", color: "var(--s-primary)", dl: "-2.3s" },
  { x: "79%", len: "4rem", size: "2rem", color: "var(--s-accent)", dl: "-4s" },
  { x: "92%", len: "8rem", size: "2.7rem", color: "var(--s-ok)", dl: "-1.8s" },
] as const

/** Natal: luzes desfocadas (bokeh) */
const BOKEH = [
  { x: "6%", y: "62%", s: "5rem", c: "var(--s-primary)", dl: "-0.5s" },
  { x: "18%", y: "82%", s: "3rem", c: "var(--s-accent)", dl: "-2.2s" },
  { x: "33%", y: "70%", s: "4rem", c: "var(--s-highlight)", dl: "-1.1s" },
  { x: "48%", y: "88%", s: "2.6rem", c: "var(--s-ok)", dl: "-3.4s" },
  { x: "58%", y: "58%", s: "3.6rem", c: "var(--s-accent)", dl: "-0.9s" },
  { x: "72%", y: "80%", s: "5.2rem", c: "var(--s-primary)", dl: "-2.8s" },
  { x: "86%", y: "66%", s: "3.2rem", c: "var(--s-highlight)", dl: "-1.6s" },
  { x: "95%", y: "86%", s: "4.4rem", c: "var(--s-accent)", dl: "-3.9s" },
] as const

/** São João: balões de papel subindo (cores = bandeirolas) */
const BALLOONS = [
  { x: "8%", s: "3.6rem", c: "var(--s-flag-1)", dur: "26s", dl: "-4s", dx: "40px" },
  { x: "27%", s: "2.8rem", c: "var(--s-flag-2)", dur: "32s", dl: "-14s", dx: "-30px" },
  { x: "48%", s: "4.2rem", c: "var(--s-flag-5)", dur: "36s", dl: "-22s", dx: "26px" },
  { x: "68%", s: "3rem", c: "var(--s-flag-4)", dur: "29s", dl: "-9s", dx: "-44px" },
  { x: "86%", s: "3.8rem", c: "var(--s-flag-3)", dur: "34s", dl: "-18s", dx: "30px" },
] as const

/** Semana do Cliente: corações subindo */
const HEARTS = [
  { x: "7%", s: "1.6rem", c: "var(--s-primary)", dur: "16s", dl: "-3s", dx: "34px" },
  { x: "17%", s: "1rem", c: "var(--s-accent)", dur: "20s", dl: "-11s", dx: "-24px" },
  { x: "31%", s: "2rem", c: "var(--s-highlight)", dur: "18s", dl: "-7s", dx: "28px" },
  { x: "44%", s: "1.2rem", c: "var(--s-primary)", dur: "22s", dl: "-15s", dx: "-34px" },
  { x: "57%", s: "1.8rem", c: "var(--s-accent)", dur: "17s", dl: "-5s", dx: "22px" },
  { x: "69%", s: "1.1rem", c: "var(--s-highlight)", dur: "21s", dl: "-13s", dx: "-28px" },
  { x: "80%", s: "2.1rem", c: "var(--s-primary)", dur: "19s", dl: "-9s", dx: "36px" },
  { x: "91%", s: "1.4rem", c: "var(--s-accent)", dur: "23s", dl: "-17s", dx: "-20px" },
] as const

/** Semana do Cliente e Liquida: brilhos de 4 pontas */
const SPARKS = [
  { x: "12%", y: "24%", s: "1.1rem", c: "var(--s-accent)", dl: "-0.4s" },
  { x: "30%", y: "14%", s: "0.7rem", c: "var(--s-highlight)", dl: "-1.8s" },
  { x: "52%", y: "30%", s: "1.3rem", c: "var(--s-accent)", dl: "-2.6s" },
  { x: "66%", y: "12%", s: "0.8rem", c: "var(--s-primary)", dl: "-0.9s" },
  { x: "84%", y: "26%", s: "1.2rem", c: "var(--s-highlight)", dl: "-3.1s" },
  { x: "20%", y: "72%", s: "0.9rem", c: "var(--s-highlight)", dl: "-2.2s" },
  { x: "45%", y: "80%", s: "1.2rem", c: "var(--s-accent)", dl: "-1.2s" },
  { x: "74%", y: "74%", s: "0.8rem", c: "var(--s-accent)", dl: "-3.4s" },
  { x: "92%", y: "58%", s: "1rem", c: "var(--s-primary)", dl: "-0.2s" },
] as const

const HEART_PATH =
  "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"

function Sparks() {
  return (
    <>
      {SPARKS.map((p, i) => (
        <i
          key={i}
          className="jh-spark"
          style={{ "--x": p.x, "--y": p.y, "--s": p.s, "--c": p.c, "--dl": p.dl } as CSSProperties}
        />
      ))}
    </>
  )
}

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

        {/* Black Friday: letreiro neon atrás do conteúdo */}
        <div className="jh-season jh-season--bf">
          <div className="jh-bf-row jh-bf-row--a">
            <div className="jh-bf-track">
              <span>{BF_PHRASE.repeat(4)}</span>
              <span>{BF_PHRASE.repeat(4)}</span>
            </div>
          </div>
          <div className="jh-bf-row jh-bf-row--b">
            <div className="jh-bf-track">
              <span>{BF_PHRASE.repeat(4)}</span>
              <span>{BF_PHRASE.repeat(4)}</span>
            </div>
          </div>
        </div>

        {/* Natal: bolas penduradas + luzes desfocadas */}
        <div className="jh-season jh-season--xmas">
          <div className="jh-bokeh">
            {BOKEH.map((b, i) => (
              <i
                key={i}
                style={
                  { "--x": b.x, "--y": b.y, "--s": b.s, "--c": b.c, "--dl": b.dl } as CSSProperties
                }
              />
            ))}
          </div>
          {BAUBLES.map((b, i) => (
            <span
              key={i}
              className="jh-bauble"
              style={
                { "--x": b.x, "--len": b.len, "--s": b.size, "--c": b.color, "--dl": b.dl } as CSSProperties
              }
            >
              <i />
            </span>
          ))}
        </div>

        {/* São João: balões de papel subindo + clarão de fogueira */}
        <div className="jh-season jh-season--june">
          {BALLOONS.map((b, i) => (
            <span
              key={i}
              className="jh-balloon"
              style={
                {
                  "--x": b.x,
                  "--s": b.s,
                  "--c": b.c,
                  "--dur": b.dur,
                  "--dl": b.dl,
                  "--dx": b.dx,
                } as CSSProperties
              }
            >
              <i />
            </span>
          ))}
        </div>

        {/* Semana do Cliente: corações flutuando + brilhos */}
        <div className="jh-season jh-season--love">
          {HEARTS.map((h, i) => (
            <span
              key={i}
              className="jh-heart"
              style={
                {
                  "--x": h.x,
                  "--s": h.s,
                  "--c": h.c,
                  "--dur": h.dur,
                  "--dl": h.dl,
                  "--dx": h.dx,
                } as CSSProperties
              }
            >
              <svg viewBox="0 0 24 24">
                <path d={HEART_PATH} />
              </svg>
            </span>
          ))}
          <Sparks />
        </div>

        {/* Liquida de Ano Novo: letreiro + brilhos de réveillon */}
        <div className="jh-season jh-season--ny">
          <div className="jh-bf-row jh-bf-row--a">
            <div className="jh-bf-track">
              <span>{NY_PHRASE.repeat(4)}</span>
              <span>{NY_PHRASE.repeat(4)}</span>
            </div>
          </div>
          <div className="jh-bf-row jh-bf-row--b">
            <div className="jh-bf-track">
              <span>{NY_PHRASE.repeat(4)}</span>
              <span>{NY_PHRASE.repeat(4)}</span>
            </div>
          </div>
          <Sparks />
        </div>
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