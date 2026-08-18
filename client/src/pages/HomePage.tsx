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
import { CTASection } from '../components/sections/CTASection';
import { SectionHeading } from '../components/ui/SectionHeading';
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
      {/* 1. Hero: Problema del usuario + CTA principal "QUIERO QUE REVISEN MI CASO" */}
      <Hero onOpenModal={() => onOpenCaseModal()} />

      {/* 2. Concepto Central: Injury Management (Manejo Integral de Lesiones) */}
      <InjuryManagementSection />

      {/* 3. Revisión Preliminar Sin Costo & Envío de Documentos */}
      <PreliminaryReviewSection onOpenModal={() => onOpenCaseModal()} />

      {/* 4. Tipos Principales de Caso (Tránsito, Laboral, Negligencia/Responsabilidad Médica) */}
      <CaseTypesSection onOpenModal={(caseType) => onOpenCaseModal(caseType)} />

      {/* 5. Proceso de Atención y Dictamen (4 Etapas de Injury Management) */}
      <HowItWorks />

      {/* 6. Servicios Médico-Periciales Especializados (PCLO e Informe Pericial) */}
      <section className="py-20 sm:py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Servicios Médico-Periciales Especializados"
            subtitle="Elaboramos dictámenes técnicos con el más alto rigor científico para evaluar pérdida de capacidad laboral, secuelas y daño corporal."
          />
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* 7. Acompañamiento Jurídico Complementario (Servicio secundario) */}
      <LegalSupportSection />

      {/* 8. Articulación Médico-Pericial y Diferenciales */}
      <Benefits />

      {/* 9. CTA Final con ambos caminos (Revisión preliminar o Agendamiento) */}
      <CTASection onOpenModal={() => onOpenCaseModal()} />
    </>
  );
}
