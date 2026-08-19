import { ShieldCheck, Stethoscope, FileSearch, Award } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SpotlightCard } from '../ui/SpotlightCard';

export function InjuryManagementSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50/50 to-white border-y border-gray-100/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Estructurado Jerárquico */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Reveal variant="fadeUp" delay={0}>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              INJURY MANAGEMENT
            </span>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Un enfoque pensado para acompañarte de principio a fin
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Analizamos y respaldamos técnicamente a las personas afectadas por secuelas físicas o funcionales, desde la revisión preliminar de antecedentes hasta la emisión del dictamen oficial.
            </p>
          </Reveal>
        </div>

        {/* Trilogía de Pilares con Spotlight */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Reveal variant="fadeUp" delay={200}>
            <SpotlightCard className="h-full">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <FileSearch className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                Estudio Inicial & Nexo Causal
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Analizamos si las fracturas, intervenciones quirúrgicas o limitaciones físicas derivan directamente del accidente o evento sufrido.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal variant="fadeUp" delay={280}>
            <SpotlightCard className="h-full">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Stethoscope className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                Valoración Médica Especializada
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Evaluamos la secuela objetivamente con la intervención de médicos especialistas peritos, determinando la pérdida funcional.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal variant="fadeUp" delay={360}>
            <SpotlightCard className="h-full">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                Dictámenes con Sustento Técnico
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Consolidamos dictámenes de PCLO e Informes Periciales sólidos y blindados para respaldar trámites o reclamaciones.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Nota institucional */}
        <Reveal variant="fadeScale" delay={420} className="mt-10">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
        </Reveal>

      </div>
    </section>
  );
}
