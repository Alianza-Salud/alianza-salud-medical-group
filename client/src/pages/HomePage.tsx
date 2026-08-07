import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/sections/Hero';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Benefits } from '../components/sections/Benefits';
import { CTASection } from '../components/sections/CTASection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { getActiveServices } from '../data/services';

/**
 * Página de inicio.
 * Ruta: /
 */
export default function HomePage() {
  usePageMeta(
    'Inicio',
    'Alianza Salud Medical Group — Acompañamiento jurídico especializado con respaldo médico integral en Medellín, Colombia.'
  );

  const services = getActiveServices();

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Resumen de servicios */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestros servicios jurídicos"
            subtitle="Brindamos acompañamiento en diversas áreas del derecho relacionadas con el ámbito médico y de responsabilidad."
          />
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* Cómo funciona */}
      <HowItWorks />

      {/* Beneficios / Diferenciadores */}
      <Benefits />

      {/* CTA de contacto */}
      <CTASection />
    </>
  );
}
