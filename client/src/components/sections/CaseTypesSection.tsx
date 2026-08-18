import { Car, Briefcase, Stethoscope, ArrowRight, UploadCloud } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CaseTypesSectionProps {
  onOpenModal?: (caseType: string) => void;
}

const caseTypes = [
  {
    title: 'Accidentes de tránsito',
    subtitle: 'Autos, Motociclistas y Peatones',
    description:
      'Evaluación de fracturas, cirugías, dolor persistente, limitaciones funcionales y secuelas corporales sufridas en siniestros viales.',
    icon: Car,
    badge: 'Motociclistas & Conductores',
  },
  {
    title: 'Accidentes laborales',
    subtitle: 'Riesgos Laborales & ARL',
    description:
      'Estudio de secuelas derivadas de accidentes ocurridos en el trabajo o enfermedades de origen laboral para calificación de PCLO.',
    icon: Briefcase,
    badge: 'Trabajadores & ARL',
  },
  {
    title: 'Negligencia y responsabilidad médica',
    subtitle: 'Evaluación Pericial Asistencial',
    description:
      'Análisis técnico-médico de nexo causal en situaciones donde una atención o procedimiento médico pudo haber generado lesiones o complicaciones.',
    icon: Stethoscope,
    badge: 'Responsabilidad Médica',
  },
];

export function CaseTypesSection({ onOpenModal }: CaseTypesSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Áreas de Especialidad</span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Tipos principales de casos</h2>
          <p className="mt-4 text-base text-gray-600">
            Nuestros peritos médicos evalúan objetivamente secuelas y lesiones en tres categorías centrales de acompañamiento.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {caseTypes.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                      {c.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-4">{c.subtitle}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => onOpenModal && onOpenModal(c.title)}
                    className="group hover:bg-primary hover:text-white transition-colors"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Revisar mi caso de {c.title.toLowerCase().split(' ')[0]}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
