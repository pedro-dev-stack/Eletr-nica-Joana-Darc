"use client"

import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Início", href: "#" },
    { label: "Serviços", href: "#servicos" },
    { label: "Sobre Nós", href: "#expertise" },
    { label: "Garantia", href: "#Garantia"},
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-all duration-300 scale-110 -z-10" />
              <Image 
                src="/Logo_loja.png"
                alt="Eletrônica Joana Dark" 
                width={64}
                height={64}
                className="w-16 h-16 object-contain rounded-lg relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-foreground tracking-tight leading-tight">Eletrônica</span>
              <span className="text-xs text-primary tracking-widest uppercase -mt-0.5">Joana Dark</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="#orcamento-form">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Solicitar Orçamento</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="#orcamento-form" onClick={() => setIsMenuOpen(false)}>
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
