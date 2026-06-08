import { Header } from "../Components/header"
import { HeroSection } from "../Components/hero-section"
import { StatsSection } from "../Components/stats-section"
import { ServicesSection } from "../Components/services-section"
import { ExpertiseSection } from "../Components/expertise-section"
import Garantia from "../Components/Garantia"
import { TestimonialsSection } from "../Components/testimonials-section"
import { ContactSection } from "../Components/contact-section"
import { Footer } from "../Components/footer"
import { BrandsCarousel } from "@/Components/carrossel_logos"
import { SectionFade } from "../Components/SectionWrapper"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-clip">
      <Header />
      <HeroSection />

      <StatsSection />
      <SectionFade><ServicesSection /></SectionFade>
      <SectionFade><ExpertiseSection /></SectionFade>
      <SectionFade><Garantia /></SectionFade>
      <SectionFade><BrandsCarousel /></SectionFade>
      <SectionFade><TestimonialsSection /></SectionFade>
      <SectionFade><ContactSection /></SectionFade>
      <Footer />
    </main>
  )
}
