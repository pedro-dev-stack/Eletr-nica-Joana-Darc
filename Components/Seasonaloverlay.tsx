"use client"

import "./Seasonaloverlay.css"
import { useEffect, useState, type CSSProperties } from "react"
import { Heart, Tag, X, Zap, type LucideIcon } from "lucide-react"
import type { Season } from "@/lib/Seasons"

/* ═══════════════════════════════════════════
   TEXTOS DOS SELOS DE PROMOÇÃO (edite aqui)
   Não invente descontos que a loja não oferece:
   ajuste o texto para o que for real.
═══════════════════════════════════════════ */
type PromoSeason = Extract<Season, "black-friday" | "customer-week" | "new-year-sale">

const PROMO: Record<
  PromoSeason,
  { tag: string; title: string; sub: string; href: string; icon: LucideIcon }
> = {
  "black-friday": {
    tag: "Black Friday",
    title: "Ofertas em TVs e micro-ondas",
    sub: "Ofertas · Preços justos · Consulte condições",
    href: "#orcamento-form",
    icon: Zap,
  },
  "customer-week": {
    tag: "Semana do Cliente",
    title: "Condições especiais para você",
    sub: "Fale com a gente e aproveite",
    href: "#orcamento-form",
    icon: Heart,
  },
  "new-year-sale": {
    tag: "Liquida de Ano Novo",
    title: "Queima de estoque",
    sub: "Aparelhos com preço especial · consulte",
    href: "#orcamento-form",
    icon: Tag,
  },
}

/** Quantidades fixas (sem Math.random => sem mismatch de hidratação). */
const BULBS = 22
const FLAKES = 16
const FLAGS = 28
const EMBERS = 12
const CONFETTI = 16

/* ═══════════════════════════════════════════
   SELO DE PROMOÇÃO (Black Friday, Semana do Cliente, Liquida)
═══════════════════════════════════════════ */
function PromoBadge({ season }: { season: PromoSeason }) {
  const [visible, setVisible] = useState(false)
  const copy = PROMO[season]
  const Icon = copy.icon
  const storageKey = `jd-promo-dismissed-${season}`

  /* só aparece depois de montar (evita mismatch) e respeita o "fechar" da sessão */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) !== "1") setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [storageKey])

  const dismiss = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(storageKey, "1")
    } catch {
      /* storage bloqueado: só fecha nesta visita */
    }
  }

  if (!visible) return null

  return (
    <aside className="so-promo" aria-label={`Aviso: ${copy.tag}`}>
      <a className="so-promo__main" href={copy.href}>
        <span className="so-promo__tag">
          <Icon aria-hidden="true" />
          {copy.tag}
        </span>
        <span className="so-promo__txt">
          <b>{copy.title}</b>
          <small>{copy.sub}</small>
        </span>
      </a>
      <button type="button" className="so-promo__close" onClick={dismiss} aria-label="Fechar aviso">
        <X aria-hidden="true" />
      </button>
    </aside>
  )
}

/* ═══════════════════════════════════════════
   CONFETE (Semana do Cliente e Liquida de Ano Novo)
═══════════════════════════════════════════ */
function Confetti() {
  return (
    <div className="so-confetti" aria-hidden="true">
      {Array.from({ length: CONFETTI }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--x": `${(i * 29 + 7) % 100}%`,
              "--dur": `${12 + ((i * 5) % 9)}s`,
              "--dl": `${-((i * 4) % 14)}s`,
              "--r": `${(i % 2 ? 1 : -1) * (180 + ((i * 47) % 360))}deg`,
              "--dx": `${(i % 2 ? 1 : -1) * (14 + ((i * 11) % 30))}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   NATAL · fio de luzes LED + neve sutil
═══════════════════════════════════════════ */
function ChristmasDecor() {
  return (
    <div className="so-xmas" aria-hidden="true">
      <div className="so-lights">
        {Array.from({ length: BULBS }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="so-snow">
        {Array.from({ length: FLAKES }, (_, i) => (
          <i
            key={i}
            style={
              {
                "--x": `${(i * 37 + 11) % 100}%`,
                "--s": `${3 + ((i * 5) % 4)}px`,
                "--dur": `${14 + ((i * 7) % 11)}s`,
                "--dl": `${-((i * 3) % 13)}s`,
                "--dx": `${(i % 2 ? 1 : -1) * (18 + ((i * 9) % 26))}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SÃO JOÃO · bandeirolas + fagulhas de fogueira
═══════════════════════════════════════════ */
function JuneDecor() {
  return (
    <div className="so-june" aria-hidden="true">
      <div className="so-flags">
        {Array.from({ length: FLAGS }, (_, i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="so-embers">
        {Array.from({ length: EMBERS }, (_, i) => (
          <i
            key={i}
            style={
              {
                "--x": `${(i * 41 + 9) % 100}%`,
                "--s": `${3 + ((i * 3) % 3)}px`,
                "--dur": `${7 + ((i * 5) % 7)}s`,
                "--dl": `${-((i * 3) % 9)}s`,
                "--dx": `${(i % 2 ? 1 : -1) * (12 + ((i * 7) % 28))}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════ */
export function SeasonalOverlay({ season }: { season: Season }) {
  switch (season) {
    case "black-friday":
      return <PromoBadge season={season} />
    case "customer-week":
    case "new-year-sale":
      return (
        <>
          <Confetti />
          <PromoBadge season={season} />
        </>
      )
    case "christmas":
      return <ChristmasDecor />
    case "sao-joao":
      return <JuneDecor />
    default:
      return null // tema padrão: nada é renderizado
  }
}

export default SeasonalOverlay