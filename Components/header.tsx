"use client"

import "./header.css"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, MessageCircle, ArrowRight, Zap } from "lucide-react"

/**
 * ATENÇÃO: confirme o DDD do WhatsApp (55 + DDD + número).
 * Na logo aparece apenas 9.8869-2960 — coloquei 83 por suposição.
 */
const WHATSAPP_URL = `https://wa.me/5583988692960?text=${encodeURIComponent(
  "Olá! Gostaria de um orçamento."
)}`
const PHONE_LABEL = "3247-2703"
const PHONE_HREF = "tel:32472703"

const navItems = [
  { label: "Início", href: "#" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre Nós", href: "#expertise" },
  { label: "Garantia", href: "#Garantia" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState("#")

  const progressRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const menuOpenRef = useRef(false)

  useEffect(() => {
    menuOpenRef.current = isMenuOpen
  }, [isMenuOpen])
  const activeIndex = navItems.findIndex((i) => i.href === active)

  /* ---------- Scroll: progresso + esconder/mostrar (1x por frame) ---------- */
  useEffect(() => {
    let ticking = false
    let lastY = window.scrollY

    const update = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${
          max > 0 ? Math.min(y / max, 1) : 0
        })`
      }

      setScrolled(y > 24)
      if (y < 200) setActive("#")

      const delta = y - lastY
      if (y < 120 || menuOpenRef.current) {
        setHidden(false)
        lastY = y
      } else if (Math.abs(delta) > 6) {
        setHidden(delta > 0) // desce = esconde, sobe = mostra
        lastY = y
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ---------- Seção ativa (IntersectionObserver) ---------- */
  useEffect(() => {
    const targets = navItems
      .filter((i) => i.href.length > 1)
      .map((i) => document.getElementById(i.href.slice(1)))
      .filter((el): el is HTMLElement => !!el)
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && window.scrollY >= 200) {
            setActive(`#${e.target.id}`)
          }
        })
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  /* ---------- Lâmpada deslizante do menu desktop ---------- */
  const moveIndicator = useCallback((idx: number) => {
    const nav = navRef.current
    const el = linkRefs.current[idx]
    if (!nav) return
    if (!el) {
      nav.style.setProperty("--ind-o", "0")
      return
    }
    nav.style.setProperty("--ind-x", `${el.offsetLeft}px`)
    nav.style.setProperty("--ind-w", `${el.offsetWidth}px`)
    nav.style.setProperty("--ind-o", "1")
  }, [])

  useEffect(() => {
    moveIndicator(activeIndex)
    const onResize = () => moveIndicator(activeIndex)
    window.addEventListener("resize", onResize)
    document.fonts?.ready.then(onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [activeIndex, moveIndicator])

  const onNavMove = (e: PointerEvent<HTMLElement>) => {
    const nav = navRef.current
    if (!nav) return
    const r = nav.getBoundingClientRect()
    nav.style.setProperty("--mx", `${e.clientX - r.left}px`)
    nav.style.setProperty("--my", `${e.clientY - r.top}px`)
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
    el.style.setProperty("--tx", `${(x - r.width / 2) * 0.14}px`)
    el.style.setProperty("--ty", `${(y - r.height / 2) * 0.25}px`)
  }
  const onCtaLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--tx", "0px")
    e.currentTarget.style.setProperty("--ty", "0px")
  }

  /* ---------- Menu mobile: trava scroll + ESC ---------- */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header
        className="jd-header"
        data-scrolled={scrolled}
        data-hidden={hidden && !isMenuOpen}
        data-open={isMenuOpen}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="jd-bg" aria-hidden="true" />

        {/* Faixa superior (desktop) */}
        <div className="jd-strip">
          <div className="jd-strip__inner">
            <div className="jd-wrap">
              <div className="jd-strip__row">
                <span className="jd-strip__live">
                  <span className="jd-dot" />
                  Assistência técnica em TVs e micro-ondas ·{" "}
                  <b>Todas as marcas</b>
                </span>
                <span className="jd-strip__links">
                  <a href={PHONE_HREF}>
                    <Phone /> {PHONE_LABEL}
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> 9.8869-2960
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="jd-wrap">
          <div className="jd-bar">
            {/* Logo */}
            <Link
              href="/"
              className="jd-logo"
              onClick={closeMenu}
              aria-label="Eletrônica Joana Dark - página inicial"
            >
              <span className="jd-logo__ring">
                <Image
                  src="/Logo.jpeg"
                  alt="Eletrônica Joana Dark"
                  width={64}
                  height={64}
                  priority
                />
              </span>
              <span className="jd-logo__text">
                <span className="jd-logo__title">Eletrônica</span>
                <span className="jd-logo__sub">Joana Dark</span>
              </span>
            </Link>

            {/* Navegação desktop */}
            <nav
              ref={navRef}
              className="jd-nav"
              aria-label="Navegação principal"
              onPointerMove={onNavMove}
              onPointerLeave={() => moveIndicator(activeIndex)}
            >
              <span className="jd-nav__ind" aria-hidden="true" />
              {navItems.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  className="jd-nav__link"
                  aria-current={active === item.href ? "true" : undefined}
                  onPointerEnter={() => moveIndicator(i)}
                  onFocus={() => moveIndicator(i)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Ações desktop */}
            <div className="jd-actions">
              <a className="jd-chip" href={PHONE_HREF} aria-label={`Ligar ${PHONE_LABEL}`}>
                <Phone />
                <span className="jd-chip__label">{PHONE_LABEL}</span>
              </a>
              <a
                className="jd-chip jd-chip--wa"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chamar no WhatsApp"
              >
                <MessageCircle />
              </a>
              <Link
                href="#orcamento-form"
                className="jd-cta"
                onPointerMove={onCtaMove}
                onPointerLeave={onCtaLeave}
              >
                <Zap />
                <span>Solicitar Orçamento</span>
                <ArrowRight />
              </Link>
            </div>

            {/* Botão mobile */}
            <button
              type="button"
              className="jd-burger"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="jd-drawer"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className="jd-progress" aria-hidden="true">
          <div ref={progressRef} className="jd-progress__bar" />
        </div>
      </header>

      {/* Drawer mobile (revelação circular) */}
      <div
        id="jd-drawer"
        className="jd-drawer"
        data-open={isMenuOpen}
        aria-hidden={!isMenuOpen}
      >
        <span className="jd-drawer__orb" aria-hidden="true" />

        <nav className="jd-drawer__nav" aria-label="Navegação mobile">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className="jd-drawer__link"
              aria-current={active === item.href ? "true" : undefined}
              style={{ "--i": i } as CSSProperties}
            >
              <small>{String(i + 1).padStart(2, "0")}</small>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="jd-drawer__foot">
          <div className="jd-drawer__contacts">
            <a className="jd-card" href={PHONE_HREF} tabIndex={isMenuOpen ? 0 : -1}>
              <span>Fixo</span>
              <b>{PHONE_LABEL}</b>
            </a>
            <a
              className="jd-card jd-card--wa"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <span>WhatsApp</span>
              <b>9.8869-2960</b>
            </a>
          </div>
          <Link
            href="#orcamento-form"
            className="jd-cta"
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            <Zap />
            <span>Solicitar Orçamento</span>
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}