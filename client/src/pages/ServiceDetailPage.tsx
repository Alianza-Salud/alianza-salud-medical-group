import { useParams, Link, useOutletContext } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, UploadCloud, FileCheck, AlertCircle } from 'lucide-react';
import { getIconByName } from '../lib/icons';
import { usePageMeta } from '../hooks/usePageMeta';
import { getServiceBySlug } from '../data/services';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Reveal } from '../components/ui/Reveal';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import type { PageLayoutContext } from '../components/layout/PageLayout';

/**
 * Página de detalle de servicio de tipo médico-pericial.
 * Rutas:
 * - /servicios/pclo-dictamen (Calificación de Pérdida de Capacidad Laboral y Ocupacional)
 * - /servicios/informe-pericial (Informe Médico Especializado de Tipo Pericial)
 */
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const { onOpenCaseModal } = useOutletContext<PageLayoutContext>();

  usePageMeta(
    service?.name || 'Servicio no encontrado',
    service?.shortDescription || 'Detalle de servicio médico-pericial de Alianza Salud Medical Group.'
  );

  if (!service) {
    return (
      <div className="py-20">
        <EmptyState
          title="Servicio no encontrado"
          description="El servicio que busca no está disponible. Puede consultar nuestros servicios médico-periciales."
          action={
            <Link to="/servicios">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Ver todos los servicios
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const IconComponent = getIconByName(service.icon);

  return (
    <>
      {/* Header Nocturno del Servicio con Luces Ambientales */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          {/* Breadcrumb Migas de Pan */}
          <Reveal variant="fadeUp" delay={0}>
            <nav aria-label="Navegación de migas de pan">
              <ol className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link to="/servicios" className="hover:text-emerald-400 transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>/</li>
                <li className="text-emerald-400 font-bold truncate max-w-xs sm:max-w-none">{service.name}</li>
              </ol>
            </nav>
          </Reveal>

          <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
            <Reveal variant="fadeScale" delay={80}>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
                <IconComponent className="h-10 w-10" />
              </div>
            </Reveal>

            <div className="space-y-3">
              <Reveal variant="fadeUp" delay={120}>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Servicio Pericial Especializado</span>
                </div>
              </Reveal>

              <Reveal variant="blurReveal" delay={180}>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {service.name}
                </h1>
              </Reveal>

              <Reveal variant="fadeUp" delay={240}>
                <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-normal">
                  {service.description}
                </p>
              </Reveal>
            </div>
          </div>

        </div>
      </section>

      {/* Contenido Detallado y Sidebar */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Columna Principal de Contenido */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Situaciones que abarca */}
              <Reveal variant="fadeUp" delay={200}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
                    <FileCheck className="h-6 w-6 text-emerald-600" />
                    <span>Escenarios y situaciones que abarca</span>
                  </h2>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {service.situations.map((situation, index) => (
                      <SpotlightCard key={index} className="p-4 shadow-2xs">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                            {situation}
                          </span>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Proceso de Atención Paso a Paso */}
              <Reveal variant="fadeUp" delay={300}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Proceso de atención y valoración
                  </h2>
                  <div className="space-y-4">
                    {service.processSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50/80 border border-gray-200/90 shadow-2xs hover:border-emerald-500/40 transition-colors"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-xs font-black text-white shadow-sm">
                          0{index + 1}
                        </span>
                        <div className="pt-1">
                          <p className="text-sm font-bold text-gray-900 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

            </div>

            {/* Sidebar CTAs y Notas */}
            <div className="lg:col-span-4">
              <Reveal variant="fadeScale" delay={260}>
                <div className="sticky top-24 space-y-6">
                  
                  {/* Tarjeta de Acción Principal */}
                  <SpotlightCard className="space-y-5">
                    <h3 className="text-lg font-extrabold text-gray-900">
                      ¿Revisamos tu caso?
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      Si tu caso se relaciona con <strong>{service.name}</strong>, evaluamos gratuitamente tus documentos iniciales sin costo ni compromiso.
                    </p>
                    <div className="space-y-3 pt-2">
                      <Button
                        size="lg"
                        fullWidth
                        onClick={() => onOpenCaseModal(service.name)}
                        className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-600/20"
                      >
                        <UploadCloud className="h-5 w-5" />
                        QUIERO QUE REVISEN MI CASO
                      </Button>
                      <Link to="/citas" className="block">
                        <Button variant="outline" size="lg" fullWidth className="font-bold">
                          Agendar valoración <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </SpotlightCard>

                  {/* Nota de Carácter Orientativo */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        <strong>Carácter orientativo:</strong> La información contenida en este servicio es orientativa técnico-médica. La viabilidad y porcentaje final dependen de la evaluación clínica pericial individual.
                      </p>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
