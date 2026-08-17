import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/sections/Hero';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { CaseTypesSection } from '../components/sections/CaseTypesSection';
import { HowItWorks } from '../components/sections/HowItWorks';
import { LegalSupportSection } from '../components/sections/LegalSupportSection';
import { Benefits } from '../components/sections/Benefits';
import { CTASection } from '../components/sections/CTASection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { getActiveServices } from '../data/services';

export default function HomePage() {
  usePageMeta(
    'Inicio',
    'Alianza Salud Medical Group — Evaluaciones médico-periciales especializadas y dictámenes de PCLO en Medellín, Colombia.'
  );

  const services = getActiveServices();

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Servicios Principales: PCLO e Informe Pericial */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Servicios Médico-Periciales Especializados"
            subtitle="Elaboramos dictámenes técnicos con el más alto rigor científico para evaluar pérdida de capacidad laboral, secuelas y daño corporal."
          />
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* Tipos de Caso / Origen de Lesión */}
      <CaseTypesSection />

      {/* Cómo funciona el proceso médico-pericial */}
      <HowItWorks />

      {/* Acompañamiento Jurídico Complementario */}
      <LegalSupportSection />

      {/* Beneficios / Articulación Médico-Pericial */}
      <Benefits />

      {/* CTA Final */}
      <CTASection />
    </>
  );
}
