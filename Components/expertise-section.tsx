"use client"

import { CheckCircle, Wrench, Lightbulb, Users, ShoppingBag } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import Image from "next/image"

export function ExpertiseSection() {
  const { ref: imageRef, isVisible: imageVisible } = useScrollReveal({ threshold: 0.2 })
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ threshold: 0.2 })

  const expertiseItems = [
    {
      icon: Wrench,
      title: "Reparo Especializado",
      description: "Consertamos TVs e micro-ondas de todas as marcas com peças originais e garantia.",
    },
    {
      icon: ShoppingBag,
      title: "Venda de Qualidade",
      description: "Vendemos aparelhos novos e seminovos revisados, todos com garantia de funcionamento.",
    },
    {
      icon: Lightbulb,
      title: "Conhecimento Técnico",
      description: "Nossa equipe está sempre atualizada com as últimas tecnologias do mercado.",
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Cada cliente é único. Oferecemos soluções personalizadas para cada necessidade.",
    },
  ]

  const certifications = [
    "Especialista em Smart TVs",
    "Técnico em Micro-ondas",
    "Peças Originais",
    "Garantia em Todos Serviços",
  ]

  return (
    <section id="expertise" className="relative py-24 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div
            ref={imageRef}
            className={`relative transition-all duration-1000 ${
              imageVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
              <Image
                src="/Loja_exterior.png"
                alt="Nossa oficina equipada"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-6 right-0 lg:right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
              <p className="text-4xl font-serif font-bold">15+</p>
              <p className="text-sm opacity-90">
                Anos de
                <br />
                Experiência
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div
            ref={contentRef}
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div>
              <p className="text-primary text-sm tracking-widest uppercase mb-4">Por que nos escolher</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground text-balance">
                Expertise que faz a diferença
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                A Eletrônica Joana Dark é referência em manutenção de TVs e micro-ondas na região. Além dos reparos,
                também trabalhamos com venda de aparelhos novos e seminovos, oferecendo as melhores opções para nossos
                clientes.
              </p>
            </div>

            {/* Expertise Items */}
            <div className="space-y-6">
              {expertiseItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-4 transition-all duration-500 ${
                    contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${(index + 2) * 150}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Nossos Diferenciais:</p>
              <div className="grid grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 transition-all duration-500 ${
                      contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${(index + 6) * 100}ms` }}
                  >
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-sm text-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
