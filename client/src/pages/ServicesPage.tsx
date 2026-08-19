import { usePageMeta } from '../hooks/usePageMeta';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { LegalSupportSection } from '../components/sections/LegalSupportSection';
import { CTASection } from '../components/sections/CTASection';
import { Reveal } from '../components/ui/Reveal';
import { getActiveServices } from '../data/services';
import { ShieldCheck, Info } from 'lucide-react';

export default function ServicesPage() {
  usePageMeta(
    'Servicios Médico-Periciales',
    'Conozca los servicios de Calificación de Pérdida de Capacidad Laboral (PCLO) e Informes Periciales Médicos de Alianza Salud Medical Group.'
  );

  const services = getActiveServices();

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <Reveal variant="fadeUp" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Dictámenes & Evaluaciones Técnicas</span>
            </div>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Servicios Médico-Periciales Especializados
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Especializados en Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO) e Informes Médico-Periciales para respaldo objetivo de procesos de reclamación.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid de servicios con Spotlight Cards */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="fadeUp" delay={200}>
            <ServiceGrid services={services} />
          </Reveal>
        </div>
      </section>

      {/* Acompañamiento Jurídico Complementario */}
      <LegalSupportSection />

      {/* Nota informativa */}
      <section className="pb-16 pt-8 bg-gray-50/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="fadeScale" delay={0}>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center flex items-start gap-3">
              <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium text-left">
                <strong>Rigor normativo:</strong> Los informes periciales y calificaciones de PCLO son elaborados por médicos peritos cualificados bajo los baremos vigentes en Colombia. Cada dictamen requiere la recepción previa de la historia clínica y antecedentes del paciente.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
