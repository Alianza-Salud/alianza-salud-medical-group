import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { CTASection } from '../components/sections/CTASection';
import { getActiveServices } from '../data/services';

/**
 * Página de servicios jurídicos.
 * Ruta: /servicios
 */
export default function ServicesPage() {
  usePageMeta(
    'Servicios Jurídicos',
    'Conozca los servicios de consultoría jurídica de Alianza Salud Medical Group: negligencia médica, responsabilidad médica, accidentes de tránsito y más.'
  );

  const services = getActiveServices();

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Servicios jurídicos"
            subtitle="Nuestro equipo jurídico, con el respaldo del área de especialidades en salud, ofrece acompañamiento en las siguientes áreas."
          />
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* Nota informativa */}
      <section className="pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-center">
            <p className="text-sm text-blue-800 leading-relaxed">
              La información presentada es de carácter informativo y no
              constituye asesoramiento legal. Cada caso requiere una evaluación
              personalizada por parte de nuestro equipo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
