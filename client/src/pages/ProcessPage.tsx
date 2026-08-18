import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, UploadCloud } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProcessTimeline } from '../components/process/ProcessTimeline';
import { Button } from '../components/ui/Button';
import type { PageLayoutContext } from '../components/layout/PageLayout';

/**
 * Página del proceso de atención.
 * Ruta: /proceso
 */
export default function ProcessPage() {
  usePageMeta(
    'Proceso de Atención',
    'Conozca el proceso de atención de Alianza Salud Medical Group: Injury Management en 4 etapas desde la revisión preliminar hasta la entrega.'
  );

  const { onOpenCaseModal } = useOutletContext<PageLayoutContext>();

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestro proceso de atención — Injury Management"
            subtitle="Le acompañamos paso a paso en 4 etapas claras: desde la revisión preliminar y estudio de nexo causal hasta la expedición y entrega del dictamen pericial."
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ProcessTimeline />
        </div>
      </section>

      {/* Nota y CTA */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 mb-8 text-left">
            <h4 className="text-sm font-bold text-emerald-900 mb-1">
              Revisión preliminar sin costo
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              No es necesario que cuentes con todos los documentos médicos o evidencias para iniciar. Puedes enviarnos la información disponible y nuestro equipo te orientará sobre la viabilidad y los siguientes pasos aplicables a tu caso.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900">
            ¿Listo para dar el primer paso?
          </h3>
          <p className="mt-3 text-gray-600 text-sm">
            Elige el camino que mejor se adapte a tus necesidades.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center items-stretch sm:items-center">
            <Button size="lg" onClick={() => onOpenCaseModal()}>
              <UploadCloud className="h-5 w-5" />
              QUIERO QUE REVISEN MI CASO
            </Button>
            <Link to="/citas">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Agendar valoración <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
