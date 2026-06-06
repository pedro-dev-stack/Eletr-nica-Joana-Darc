"use client"

import { Zap, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import Image from "next/image"

export function Footer() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })
  const currentYear = new Date().getFullYear()

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
    { icon: Instagram, href: "https://www.instagram.com/joanaDarkxaviergaldino?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
    { icon: MessageCircle, href: "https://wa.me/558388692960", label: "WhatsApp" },
  ]

  return (
    <footer ref={ref} className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                              src="/Logo_loja.png"
                              alt="Eletrônica Joana Dark" 
                              width={64}
                              height={64}
                              className="w-16 h-16 object-contain rounded-lg relative z-10"
                            />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-foreground tracking-tight">Eletrônica</span>
                <span className="text-xs text-primary tracking-widest uppercase -mt-1">Joana Dark</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Especialistas em manutenção e venda de TVs e Micro-ondas. Mais de 15 anos de experiência no mercado.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li
                  key={link.label}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Serviços</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li
                  key={service}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <span className="text-sm text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Whatsapp: (83) 98869-2960</li>
              <li>Fixo: (83) 3247-2703</li>
              <li>darkgaldino2016@gmail.com</li>
              <li>
                Av. Monteiro da Franca, 516 A - Manaíra, Joana Pessoa - PB, 58038-151
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} Eletrônica Joana Dark. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
