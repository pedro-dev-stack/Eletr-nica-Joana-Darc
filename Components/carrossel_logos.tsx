"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import ShapeGrid from "@/Components/Backgrounds/Squares"

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

export function BrandsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [rawMouse, setRawMouse] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x, y })
    setRawMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const row1 = BRANDS.slice(0, 6)
  const row2 = BRANDS.slice(6, 11)
  const row3 = BRANDS.slice(11)

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Fade masks laterais cobrindo a seção toda */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 xl:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 xl:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* Squares background */}
      <div className="absolute inset-0 z-0">
        <ShapeGrid
          direction="right"
          speed={0}
          borderColor="rgba(150,150,150,0.45)"  // ← COR DAS BORDAS DOS QUADRADOS
          hoverFillColor="#1a3a6b"              // ← COR DO HOVER DOS QUADRADOS
          squareSize={50}
          externalMousePos={rawMouse}
        />
      </div>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[min(600px,80vw)] h-[min(600px,80vw)] rounded-full blur-3xl opacity-20 transition-transform duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 60%)",
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-[min(500px,70vw)] h-[min(500px,70vw)] rounded-full blur-3xl opacity-15 transition-transform duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.15), transparent 60%)",
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div
          className={`max-w-4xl mx-auto text-center px-4 sm:px-6 mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >


          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
            Todas as marcas.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Um padrão.</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 8 Q50 2, 100 6 T200 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-primary/40"
                />
              </svg>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Experiência técnica com todas as tecnologias: LED, OLED, QLED, LCD.
            <br className="hidden sm:block" />
            Magnetron, inverter, grill — nenhum segredo para nós.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">

          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            <CarouselRow brands={row1} speed={55} direction="left" isVisible={isVisible} index={0} />
            <CarouselRow brands={row2} speed={45} direction="right" isVisible={isVisible} index={1} />
            <CarouselRow brands={row3} speed={60} direction="left" isVisible={isVisible} index={2} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          from { transform: translateX(0) translateZ(0); }
          to   { transform: translateX(-50%) translateZ(0); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%) translateZ(0); }
          to   { transform: translateX(0) translateZ(0); }
        }
        @keyframes card-shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }

        .brand-carousel-track-left  { animation: scroll-left  var(--scroll-speed) linear infinite; }
        .brand-carousel-track-right { animation: scroll-right var(--scroll-speed) linear infinite; }

        .brand-carousel-track-left[data-paused="true"],
        .brand-carousel-track-right[data-paused="true"] {
          animation-play-state: paused;
        }

        /*
          KEY FIX: The card lift (translateY) must not be clipped.
          .brand-card-lift-zone uses padding + negative margin to
          create invisible space above/below for the hover lift effect.
        */
        .brand-card-lift-zone {
          overflow: hidden;
          padding: 20px 0;
          margin: -20px 0;
        }

        .brand-card {
          flex-shrink: 0;
          position: relative;
          transition:
            transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.35s ease,
            border-color 0.3s ease,
            background-color 0.3s ease;
          /* flat — no 3D perspective to avoid compositing bugs */
          transform-style: flat;
          will-change: transform;
        }

        .brand-card:hover {
          transform: translateY(-10px) scale(1.05) !important;
          z-index: 10;
        }

        .brand-card-inner {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(200,220,255,0.1));
          border: 1px solid rgba(100,160,255,0.4);
          backdrop-filter: blur(12px);
          box-shadow: 0 0 12px rgba(80,140,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.35s ease;
        }

        .brand-card:hover .brand-card-inner {
          background: linear-gradient(135deg, rgba(80,140,255,0.25), rgba(160,100,255,0.2));
          border-color: rgba(120,180,255,0.8);
          box-shadow:
            0 0 24px rgba(80,140,255,0.4),
            0 20px 40px -10px rgba(80,140,255,0.3),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        /* Shimmer */
        .brand-card-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .brand-card:hover .brand-card-shimmer {
          opacity: 1;
          animation: card-shimmer 2s ease-in-out infinite;
        }

        .brand-card img {
          transition: filter 0.4s ease, opacity 0.4s ease;
          opacity: 0.85;
        }
        .brand-card:hover img {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-carousel-track-left,
          .brand-carousel-track-right { animation: none; }
        }
      `}</style>
    </section>
  )
}

interface CarouselRowProps {
  brands: Brand[]
  speed: number
  direction: "left" | "right"
  isVisible: boolean
  index: number
}

function CarouselRow({ brands, speed, direction, isVisible, index }: CarouselRowProps) {
  const [isPaused, setIsPaused] = useState(false)
  // Quadruplicate for a seamless loop
  const items = [...brands, ...brands, ...brands, ...brands]

  return (
    <div
      className="transition-all duration-1000"
      style={{
        transitionDelay: `${index * 150}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/*
        brand-card-lift-zone: overflow:hidden + padding/margin trick
        This is the ONLY place overflow:hidden is applied.
        The padding gives room for cards to lift without being clipped.
      */}
      <div
        className="brand-card-lift-zone"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 sm:gap-8 lg:gap-10 ${
            direction === "left"
              ? "brand-carousel-track-left"
              : "brand-carousel-track-right"
          }`}
          style={{ "--scroll-speed": `${speed}s` } as React.CSSProperties}
          data-paused={isPaused ? "true" : "false"}
        >
          {items.map((brand, idx) => (
            <BrandCard key={`${brand.name}-${idx}`} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="brand-card">
      <div className="brand-card-inner w-36 h-24 sm:w-44 sm:h-28 lg:w-52 lg:h-32">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shimmer */}
        <div className="brand-card-shimmer" />

        {/* Logo */}
        <div className="relative h-full flex items-center justify-center p-4 sm:p-5 lg:p-6">
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={brand.width}
            height={brand.height}
            className="object-contain max-w-full max-h-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}