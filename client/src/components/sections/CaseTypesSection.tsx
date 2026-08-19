import { Car, Briefcase, Stethoscope, ArrowRight, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Reveal } from '../ui/Reveal';

interface CaseTypesSectionProps {
  onOpenModal?: (caseType: string) => void;
}

const caseTypes = [
  {
    num: '01',
    title: 'Accidentes de tránsito',
    subtitle: 'Autos, Motociclistas y Peatones',
    description:
      'Evaluación de fracturas, cirugías, dolor persistente, limitaciones funcionales y secuelas corporales sufridas en siniestros viales.',
    icon: Car,
    badge: 'Motociclistas & Conductores',
  },
  {
    num: '02',
    title: 'Accidentes laborales',
    subtitle: 'Riesgos Laborales & ARL',
    description:
      'Estudio de secuelas derivadas de accidentes ocurridos en el trabajo o enfermedades de origen laboral para calificación de PCLO.',
    icon: Briefcase,
    badge: 'Trabajadores & ARL',
  },
  {
    num: '03',
    title: 'Negligencia y responsabilidad médica',
    subtitle: 'Evaluación Pericial Asistencial',
    description:
      'Análisis técnico-médico de nexo causal en situaciones donde una atención o procedimiento médico pudo haber generado lesiones.',
    icon: Stethoscope,
    badge: 'Responsabilidad Médica',
  },
];

export function CaseTypesSection({ onOpenModal }: CaseTypesSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-gray-50/70 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Estructurado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <Reveal variant="fadeUp" delay={0}>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Áreas de Especialidad
            </span>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Categorías principales de casos que evaluamos
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base text-gray-600">
              Nuestros médicos especialistas peritos evalúan objetivamente secuelas y lesiones en tres categorías centrales.
            </p>
          </Reveal>
        </div>

        {/* Grid de Cards con Spotlight y Hover Lift */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {caseTypes.map((c, idx) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} variant="fadeUp" delay={200 + idx * 80}>
                <SpotlightCard className="flex flex-col justify-between h-full group">
                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-extrabold font-mono text-gray-400 group-hover:text-emerald-600 transition-colors">
                        {c.num}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                        {c.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 mb-4">{c.subtitle}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                  </div>

                  {/* Acento inferior de barra y CTA */}
                  <div className="mt-8 pt-5 border-t border-gray-100/90">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => onOpenModal && onOpenModal(c.title)}
                      className="group/btn hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all font-bold"
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>Revisar mi caso</span>
                      <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
