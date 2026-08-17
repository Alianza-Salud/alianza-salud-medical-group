import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { LegalSupportSection } from '../components/sections/LegalSupportSection';
import { CTASection } from '../components/sections/CTASection';
import { getActiveServices } from '../data/services';

export default function ServicesPage() {
  usePageMeta(
    'Servicios Médico-Periciales',
    'Conozca los servicios de Calificación de Pérdida de Capacidad Laboral (PCLO) e Informes Periciales Médicos de Alianza Salud Medical Group.'
  );

  const services = getActiveServices();

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Servicios Médico-Periciales"
            subtitle="Especializados en Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO) e Informes Médico-Periciales para respaldo de procesos de reclamación."
          />
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* Acompañamiento Jurídico Complementario */}
      <LegalSupportSection />

      {/* Nota informativa */}
      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-center">
            <p className="text-sm text-blue-800 leading-relaxed">
              Los informes periciales y calificaciones de PCLO son elaborados por peritos médicos cualificados bajo baremos vigentes en Colombia. Cada dictamen requiere la recepción previa de historia clínica y antecedentes del paciente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
