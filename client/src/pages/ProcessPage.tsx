import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, UploadCloud, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { ProcessTimeline } from '../components/process/ProcessTimeline';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
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
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <Reveal variant="fadeUp" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Ruta de Atención Injury Management</span>
            </div>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Proceso de atención transparente en 4 etapas
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Le acompañamos paso a paso: desde la revisión preliminar de antecedentes y estudio de nexo causal hasta la expedición y entrega del dictamen pericial oficial.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="fadeUp" delay={200}>
            <ProcessTimeline />
          </Reveal>
        </div>
      </section>

      {/* Nota y CTA */}
      <section className="bg-gray-50/70 py-16 sm:py-24 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          
          <Reveal variant="fadeScale" delay={0}>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 mb-10 text-left flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-emerald-950 mb-1">
                  Revisión preliminar sin ningún costo
                </h4>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                  No es necesario que cuentes con todos los documentos médicos o evidencias para iniciar. Puedes enviarnos la información disponible y nuestro equipo te orientará sobre la viabilidad de tu caso.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fadeUp" delay={100}>
            <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              ¿Listo para dar el primer paso?
            </h3>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="mt-3 text-gray-600 text-sm">
              Elige el camino que mejor se adapte a tus necesidades.
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={240}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center items-stretch sm:items-center">
              <Button size="lg" onClick={() => onOpenCaseModal()} className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20">
                <UploadCloud className="h-5 w-5" />
                QUIERO QUE REVISEN MI CASO
              </Button>
              <Link to="/citas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold">
                  Agendar valoración <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
