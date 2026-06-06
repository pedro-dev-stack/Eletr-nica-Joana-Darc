"use client"

import { Button } from "@/Components/ui/button"
import { ArrowRight, ChevronDown, Shield, Clock, Award, Tv, Zap } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import Image from "next/image"

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* ── FUNDO ── */}
      <div className="absolute inset-0 bg-background">
        {/* Orbs */}
        <div className="absolute top-1/3 left-0 w-[min(600px,80vw)] h-[min(600px,80vw)] bg-primary/8 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[min(500px,60vw)] h-[min(500px,60vw)] bg-accent/8 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Linha diagonal decorativa */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-60" />
        </div>
      </div>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 xl:gap-24 items-center w-full">

          {/* ── LADO ESQUERDO ── */}
          <div
            className={`max-w-2xl transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Número decorativo de fundo */}
            <div
              aria-hidden
              className="select-none pointer-events-none absolute -top-6 -left-4 text-[clamp(80px,20vw,180px)] font-serif font-bold text-foreground/[0.03] leading-none hidden lg:block"
            >
              01
            </div>

            {/* Tag de serviço */}
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent/20" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground tracking-widest uppercase font-medium">
                TVs &amp; Micro-ondas
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold text-foreground leading-[1.05] mb-6 sm:mb-8">
              {/* Mobile: compacto / Desktop: grande */}
              <span className="block text-[clamp(2.4rem,7vw,5.5rem)]">
                Consertamos.
              </span>
              <span className="block text-[clamp(2.4rem,7vw,5.5rem)] text-primary">
                Vendemos.
              </span>
              <span className="block text-[clamp(1.1rem,2.5vw,1.6rem)] font-sans font-normal text-muted-foreground mt-3 sm:mt-4 leading-relaxed max-w-lg">
                Manutenção especializada em TVs e micro-ondas com peças
                originais, garantia real e atendimento que respeita o seu tempo.
              </span>
            </h1>

            {/* CTA */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-10 sm:mb-14">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 rounded-xl font-semibold"
                onClick={() => {
                  document.getElementById("orcamento-form")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Solicitar orçamento grátis
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-sm sm:text-base hover:bg-card"
                onClick={() => {
                  document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Ver serviços
              </Button>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8">
              {[
                { icon: Shield, label: "Garantia 90 dias" },
                { icon: Clock, label: "Atendimento rápido" },
                { icon: Award, label: "Peças originais" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── LADO DIREITO — imagem + cards flutuantes ── */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Container da imagem */}
            <div className="relative animate-float">
              {/* Moldura externa decorativa */}
              <div className="absolute -inset-3 rounded-[2rem] border border-border/50" />
              <div className="absolute -inset-6 rounded-[2.5rem] border border-border/20" />

              {/* Imagem principal */}
              <div className="relative w-[260px] h-[340px] sm:w-[300px] sm:h-[400px] lg:w-[340px] lg:h-[460px] xl:w-[380px] xl:h-[500px] rounded-[1.75rem] overflow-hidden border border-border bg-card">
                <Image
                  src="/office_loja.png"
                  alt="Interior da loja — TVs e micro-ondas"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />

                {/* Texto sobre a imagem */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Nossa loja</p>
                  <p className="text-sm font-semibold text-foreground">Atendimento presencial e técnico</p>
                </div>
              </div>

              {/* Card flutuante — direita */}
              <div
                className={`absolute -right-2 sm:-right-6 top-[18%] bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/20 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
                    <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">TVs & Micro-ondas</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Reparo especializado</p>
                  </div>
                </div>
                {/* Barra decorativa */}
                <div className="mt-3 h-1 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">+500 reparos realizados</p>
              </div>

              {/* Card flutuante — esquerda */}
              <div
                className={`absolute -left-2 sm:-left-6 bottom-[22%] bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/20 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/15 rounded-xl flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Venda</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Novos e seminovos</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-accent/30">
                      <div className="h-full rounded-full bg-accent" style={{ width: i < 4 ? "100%" : "60%" }} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Estoque disponível</p>
              </div>

              {/* Ponto de luz no canto */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        className={`relative z-10 flex flex-col items-center gap-2 pb-8 transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.2em] uppercase">
          Rolar para ver mais
        </span>
        <div className="w-5 h-8 border border-border rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}