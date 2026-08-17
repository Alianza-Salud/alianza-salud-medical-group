import { Car, Briefcase, Stethoscope } from 'lucide-react';
import { Card } from '../ui/Card';

const caseTypes = [
  {
    title: 'Accidentes de Tránsito',
    description:
      'Evaluación de lesiones, secuelas funcionales y determinación de pérdida de capacidad laboral por siniestros viales.',
    icon: Car,
  },
  {
    title: 'Accidentes Laborales',
    description:
      'Dictámenes de origen de enfermedad profesional y calificación de PCLO por accidentes ocurridos en el entorno de trabajo.',
    icon: Briefcase,
  },
  {
    title: 'Negligencia y Responsabilidad Médica',
    description:
      'Análisis técnico-médico de nexo causal y valoración de daños corporales o complicaciones por presunta mala praxis asistencial.',
    icon: Stethoscope,
  },
];

export function CaseTypesSection() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Contextos de Atención</span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Principales tipos de casos</h2>
          <p className="mt-4 text-base text-gray-600">
            Nuestros peritos médicos evalúan lesiones y consecuencias corporales en los tres principales contextos de reclamación.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {caseTypes.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
