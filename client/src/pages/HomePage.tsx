import { useOutletContext } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { Hero } from '../components/sections/Hero';
import { InjuryManagementSection } from '../components/sections/InjuryManagementSection';
import { PreliminaryReviewSection } from '../components/sections/PreliminaryReviewSection';
import { CaseTypesSection } from '../components/sections/CaseTypesSection';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { HowItWorks } from '../components/sections/HowItWorks';
import { LegalSupportSection } from '../components/sections/LegalSupportSection';
import { Benefits } from '../components/sections/Benefits';
import { FAQSection } from '../components/sections/FAQSection';
import { CTASection } from '../components/sections/CTASection';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { getActiveServices } from '../data/services';
import type { PageLayoutContext } from '../components/layout/PageLayout';

export default function HomePage() {
  usePageMeta(
    'Inicio',
    'Alianza Salud Medical Group — Injury Management, revisión preliminar sin costo de casos médico-periciales y calificaciones de PCLO en Medellín, Colombia.'
  );

  const { onOpenCaseModal } = useOutletContext<PageLayoutContext>();
  const services = getActiveServices();

  return (
    <>
      {/* 1. Hero: Problema del usuario + CTA principal + Visualizador de Nodos de Injury Management */}
      <Hero onOpenModal={() => onOpenCaseModal()} />

      {/* 2. Concepto Central: Injury Management (Manejo Integral de Lesiones con Spotlight Cards) */}
      <InjuryManagementSection />

      {/* 3. Revisión Preliminar Sin Costo & Tarjetas Flotantes de Soportes */}
      <PreliminaryReviewSection onOpenModal={() => onOpenCaseModal()} />

      {/* 4. Tipos Principales de Caso (Tránsito, Laboral, Negligencia/Responsabilidad Médica) */}
      <CaseTypesSection onOpenModal={(caseType) => onOpenCaseModal(caseType)} />

      {/* 5. Proceso de Atención y Dictamen (4 Etapas de Injury Management con Timeline) */}
      <HowItWorks />

      {/* 6. Servicios Médico-Periciales Especializados (PCLO e Informe Pericial) */}
      <section className="py-20 sm:py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="fadeUp" delay={0}>
            <SectionHeading
              title="Servicios Médico-Periciales Especializados"
              subtitle="Elaboramos dictámenes técnicos con el más alto rigor científico para evaluar pérdida de capacidad laboral, secuelas y daño corporal."
            />
          </Reveal>
          <Reveal variant="fadeUp" delay={160}>
            <ServiceGrid services={services} />
          </Reveal>
        </div>
      </section>

      {/* 7. Acompañamiento Jurídico Complementario */}
      <LegalSupportSection />

      {/* 8. Articulación Médico-Pericial y Diferenciales */}
      <Benefits />

      {/* 9. Preguntas Frecuentes Acordeón */}
      <FAQSection />

      {/* 10. CTA Final con Resplandor Ambiental */}
      <CTASection onOpenModal={() => onOpenCaseModal()} />
    </>
  );
}
