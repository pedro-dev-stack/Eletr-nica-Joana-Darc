import { Header } from "../Components/header"
import { HeroSection } from "../Components/hero-section"
import { StatsSection } from "../Components/stats-section"
import { ServicesSection } from "../Components/services-section"
import { ExpertiseSection } from "../Components/expertise-section"
import Garantia from "../Components/Garantia";
import { TestimonialsSection } from "../Components/testimonials-section"
import { CTASection } from "../Components/cta-section"
import { ContactSection } from "../Components/contact-section"
import { Footer } from "../Components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ExpertiseSection />
      <section className="flex justify-center items-center py-12 overflow-hidden" style={{marginTop: "20px"}}>
        <Garantia />
    </section>
    <p style={{marginBottom: "150px"}} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center font-light">
  Na <span className="text-foreground font-semibold">Eletrônica Joana Dark</span>, realizamos reparo e conserto de TVs, micro-ondas e eletrodomésticos com <span className="text-primary font-medium">garantia de serviço</span> e qualidade. 
  Atendimento especializado, diagnóstico preciso e compromisso total com você.
</p>
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </main>
  )
}
