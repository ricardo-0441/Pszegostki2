import React from 'react';
import Navbar from "@/components/magicui/menu";
import { TestimonialsMarquee } from "@/components/magicui/opinion";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import HeroSection from "@/components/magicui/hero";
import Services from "@/components/magicui/services";
import Footer from "@/components/magicui/footer";
import PropertyCarousel from "@/components/magicui/property";
import WhatsappFloatingButton from "@/components/magicui/whatsapp";
import TeamSection from "@/components/magicui/staff";
import Logos from "@/components/magicui/sponsor";
import RealEstateCTA from "@/components/magicui/call-action";
import PreloaderAnimation from "@/components/magicui/loading";
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Cursor animado */}
      <SmoothCursor />
      {/* Preloader */}
      < PreloaderAnimation/>
      {/* Menú principal */}
      <header className="w-full">
        <Navbar />
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        {/* Sección Hero */}
        <HeroSection />
        <Logos />
      <TeamSection />
        <PropertyCarousel />

        {/* Sección Servicios */}

        {/* Sección Opiniones */}
        <section className="mt-12">
          <TestimonialsMarquee />
          <RealEstateCTA />
        </section>
      </main>

      {/* Pie de página */}
      <WhatsappFloatingButton />

      <Footer />
    </div>
  );
}
