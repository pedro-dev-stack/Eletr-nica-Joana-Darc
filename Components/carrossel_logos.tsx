"use client"

import "./carrossel-logos.css"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"

interface Brand {
  name: string
  logo: string
  width: number
  height: number
}

const BRANDS: Brand[] = [
  { name: "Samsung", logo: "/logos/SAMSUNG.avif", width: 160, height: 60 },
  { name: "LG", logo: "/logos/lg.avif", width: 160, height: 60 },
  { name: "Sony", logo: "/logos/SONY.avif", width: 160, height: 60 },
  { name: "Panasonic", logo: "/logos/panasonic.avif", width: 160, height: 60 },
  { name: "Philco", logo: "/logos/PHILCO.avif", width: 160, height: 60 },
  { name: "Brastemp", logo: "/logos/Brastemp.avif", width: 160, height: 60 },
  { name: "Consul", logo: "/logos/Consul.avif", width: 160, height: 60 },
  { name: "Electrolux", logo: "/logos/ELETROLUX.avif", width: 160, height: 60 },
  { name: "Midea", logo: "/logos/MIDEA.avif", width: 160, height: 60 },
  { name: "Philips", logo: "/logos/PHILIPS.avif", width: 160, height: 60 },
  { name: "TCL", logo: "/logos/TCL.avif", width: 160, height: 60 },
  { name: "AOC", logo: "/logos/AOC.avif", width: 160, height: 60 },
  { name: "Semp", logo: "/logos/Semp.avif", width: 160, height: 60 },
  { name: "Fischer", logo: "/logos/fischer.avif", width: 160, height: 60 },
  { name: "Britânia", logo: "/logos/BRITANIA.avif", width: 160, height: 60 },
  { name: "Mondial", logo: "/logos/Mondial.avif", width: 160, height: 60 },
]

/** dur = segundos para percorrer 1 ciclo (maior = mais lento) */
const ROWS = [
  { brands: BRANDS.slice(0, 6), dur: 55, reverse: false },
  { brands: BRANDS.slice(6, 11), dur: 45, reverse: true },
  { brands: BRANDS.slice(11), dur: 60, reverse: false },
]

const TECHS = [
  { label: "TVs", items: ["LED", "OLED", "QLED", "LCD"] },
  { label: "Micro-ondas", items: ["Magnetron", "Inverter", "Grill"] },
]

const delay = (n: number) => ({ "--d": n }) as CSSProperties

export function BrandsCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)

  /* Único estado da seção: entrou / está na tela.
     Só muda ao cruzar o limite, nunca por frame. */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold: 0.1 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="br"
      data-seen={seen}
      data-live={live}
      aria-label="Marcas atendidas"
    >
      <div className="br-head">
        <p className="br-eyebrow br-rv" style={delay(0)}>
          <span className="br-dot" aria-hidden="true" />
          Marcas atendidas
        </p>

        <h2 className="br-title br-rv" style={delay(1)}>
          Todas as marcas.{" "}
          <span className="br-title__mark">
            Um padrão.
            <svg
              className="br-squig"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path pathLength={1} d="M2 8 Q50 2 100 6 T198 8" />
            </svg>
          </span>
        </h2>

        <p className="br-lead br-rv" style={delay(2)}>
          Experiência técnica com todas as tecnologias: LED, OLED, QLED, LCD.
          <br className="hidden sm:block" />
          Magnetron, inverter, grill — nenhum segredo para nós.
        </p>

        <div className="br-techs br-rv" style={delay(3)}>
          {TECHS.map((group) => (
            <div className="br-tech" key={group.label}>
              <b>{group.label}</b>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="br-rows">
        {ROWS.map((row, i) => (
          <MarqueeRow key={i} index={i} {...row} />
        ))}
      </div>
    </section>
  )
}

/* Linha: 2 grupos idênticos + animação CSS (zero JS por frame) */
function MarqueeRow({
  brands,
  dur,
  reverse,
  index,
}: {
  brands: Brand[]
  dur: number
  reverse: boolean
  index: number
}) {
  // cada grupo repete as marcas 2x para ser sempre mais largo que a tela
  const base = [...brands, ...brands]

  return (
    <div className="br-row" style={{ "--r": index } as CSSProperties}>
      <div className="br-viewport">
        <div
          className="br-track"
          style={
            {
              "--dur": `${dur}s`,
              "--dir": reverse ? "reverse" : "normal",
            } as CSSProperties
          }
        >
          <ul className="br-group">
            {base.map((b, i) => (
              <li key={`${b.name}-${i}`}>
                <BrandCard brand={b} />
              </li>
            ))}
          </ul>

          {/* cópia decorativa para o loop contínuo */}
          <div className="br-group" aria-hidden="true">
            {base.map((b, i) => (
              <BrandCard key={`${b.name}-${i}-b`} brand={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="br-card">
      <div className="br-face">
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={brand.width}
          height={brand.height}
          sizes="208px"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className="br-name">{brand.name}</span>
      </div>
    </div>
  )
}