import { ShieldCheck, Stethoscope, FileSearch, Award } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

export function InjuryManagementSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="INJURY MANAGEMENT — Manejo Integral de Lesiones"
          subtitle="Acompañamos a las personas afectadas por secuelas físicas o funcionales desde el análisis inicial hasta la expedición del dictamen técnico."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSearch className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Estudio Inicial & Nexo Causal
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Analizamos minuciosamente si las fracturas, intervenciones quirúrgicas o limitaciones físicas derivan directamente del accidente o evento sufrido.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Stethoscope className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Valoración Médica Especializada
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Evaluamos la secuela con la intervención de médicos especialista peritos, determinando objetivamente la pérdida de capacidad funcional.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs hover:shadow-md transition-shadow">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Dictámenes con Sustento Técnico
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Consolidamos dictámenes de PCLO e Informes Periciales sólidos y blindados técnicamente para respaldar reclamaciones o trámites institucionales.
            </p>
          </div>
        </div>

        {/* Nota institucional */}
        <div className="mt-10 rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Rigor Científico e Independencia Pericial
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Nuestro valor central radica en el análisis clínico y pericial objetivo de la secuela corporal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
