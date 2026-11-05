"use client"

import "./footer.css"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
} from "lucide-react"

/* ═══════════════════════════════════════════
   DADOS
═══════════════════════════════════════════ */
const WHATSAPP_URL = `https://wa.me/5583988692960?text=${encodeURIComponent(
  "Olá! Gostaria de um orçamento."
)}`
const PHONE_FIXO_HREF = "tel:+558332472703"
const EMAIL = "darkgaldino2016@gmail.com"
const ADDRESS = "Av. Monteiro da Franca, 516 A - Manaíra, João Pessoa - PB, 58038-151"
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

const quickLinks = [
  { label: "Início", href: "#" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre nós", href: "#expertise" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
]

const services = [
  "Manutenção de TVs",
  "Manutenção de Micro-ondas",
  "Venda de TVs",
  "Venda de Micro-ondas",
  "Aparelhos Seminovos",
]

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/joanaDarkxaviergaldino?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram",
  },
  { icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
]

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)
  const currentYear = new Date().getFullYear()

  /* entrada (1x) + pausa das animações fora da tela */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const d = (n: number) => ({ "--d": n }) as CSSProperties

  return (
    <footer ref={ref} className="ft" data-seen={seen} data-live={live}>
      {/* Fundo */}
      <div className="ft-bg" aria-hidden="true">
        <div className="ft-bg__grid" />
        <svg className="ft-traces" viewBox="0 0 520 260" fill="none">
          <path className="base" pathLength={100} d="M520 40 H390 L350 80 H190 L160 50 H0" />
          <path className="pulse" pathLength={100} d="M520 40 H390 L350 80 H190 L160 50 H0" />
          <path className="base" pathLength={100} d="M520 170 H430 L390 210 H260 L230 180 H80" />
          <path className="pulse" pathLength={100} d="M520 170 H430 L390 210 H260 L230 180 H80" />
          <circle cx="350" cy="80" r="4" />
          <circle cx="390" cy="210" r="4" />
        </svg>
      </div>

      <div className="ft-wrap">
        {/* ───────── FAIXA DE CHAMADA ───────── */}
        <div className="ft-cta ft-rv" style={d(0)}>
          <div className="ft-cta__in">
            <div>
              <p className="ft-cta__tag">
                <span className="ft-dot" /> Atendimento rápido
              </p>
              <h3>
                Seu aparelho parou? <em>Chame agora.</em>
              </h3>
              <p>Fale com a gente pelo WhatsApp e receba um orçamento grátis, sem compromisso.</p>
            </div>
            <div className="ft-cta__btns">
              <a className="ft-btn ft-btn--wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                <span>Chamar no WhatsApp</span>
              </a>
              <a className="ft-btn ft-btn--ghost" href={PHONE_FIXO_HREF}>
                <Phone aria-hidden />
                <span>Ligar agora</span>
              </a>
            </div>
          </div>
        </div>

        {/* ───────── COLUNAS ───────── */}
        <div className="ft-grid">
          {/* Marca */}
          <div className="ft-col ft-col--brand ft-rv" style={d(1)}>
            <Link href="/" className="ft-logo" aria-label="Eletrônica Joana Dark - página inicial">
              <span className="ft-logo__ring">
                <Image src="/Logo.jpeg" alt="Eletrônica Joana Dark" width={64} height={64} />
              </span>
              <span className="ft-logo__text">
                <span className="ft-logo__title">Eletrônica</span>
                <span className="ft-logo__sub">Joana Dark</span>
              </span>
            </Link>
            <p className="ft-about">
              Especialistas em <strong>manutenção e venda de TVs e micro-ondas</strong>. Mais de 15
              anos de experiência no mercado.
            </p>
            <ul className="ft-social">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <s.icon aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links rápidos */}
          <nav className="ft-col ft-col--links ft-rv" style={d(2)} aria-label="Links rápidos">
            <h4 className="ft-h">Links Rápidos</h4>
            <ul className="ft-list">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="ft-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Serviços */}
          <div className="ft-col ft-col--services ft-rv" style={d(3)}>
            <h4 className="ft-h">Serviços</h4>
            <ul className="ft-list">
              {services.map((s) => (
                <li key={s}>
                  <Link href="#servicos" className="ft-link">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="ft-col ft-col--contact ft-rv" style={d(4)}>
            <h4 className="ft-h">Contato</h4>
            <ul className="ft-contact">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <i>
                    <MessageCircle aria-hidden />
                  </i>
                  <span>
                    <small>WhatsApp</small>
                    (83) 98869-2960
                  </span>
                </a>
              </li>
              <li>
                <a href={PHONE_FIXO_HREF}>
                  <i>
                    <Phone aria-hidden />
                  </i>
                  <span>
                    <small>Fixo</small>
                    (83) 3247-2703
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>
                  <i>
                    <Mail aria-hidden />
                  </i>
                  <span>
                    <small>E-mail</small>
                    {EMAIL}
                  </span>
                </a>
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <i>
                    <MapPin aria-hidden />
                  </i>
                  <span>
                    <small>Endereço</small>
                    {ADDRESS}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ───────── BARRA INFERIOR ───────── */}
        <div className="ft-bar ft-rv" style={d(5)}>
          <p className="ft-copy">
            © {currentYear} Eletrônica Joana Dark. Todos os direitos reservados.
          </p>
          <div className="ft-bar__right">
            <div className="ft-legal">
              <Link href="#">Política de Privacidade</Link>
              <Link href="#">Termos de Uso</Link>
            </div>
            <button
              type="button"
              className="ft-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Voltar ao topo"
            >
              Topo
              <i>
                <ArrowUp aria-hidden />
              </i>
            </button>
          </div>
        </div>
      </div>

      {/* Wordmark gigante com feixe de scanner */}
      <div className="ft-mark" aria-hidden="true">
        <span>Joana Dark</span>
        <i className="ft-mark__beam" />
      </div>
    </footer>
  )
}