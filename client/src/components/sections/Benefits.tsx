import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Benefits() {
  const benefits = [
    {
      title: 'Peritaje Médico de Alto Rigor',
      description:
        'Dictámenes estructurados bajo normativa técnico-legal colombiana y baremos vigentes para calificación de pérdida de capacidad laboral.',
    },
    {
      title: 'Evaluación Técnica Independiente',
      description:
        'Nuestros informes aportan pruebas médico-científicas objetivas para sustentar controversias ante aseguradoras, juntas o juzgados.',
    },
    {
      title: 'Gestión Administrativa Agilizada',
      description:
        'La auxiliar de admisiones coordina la recepción de historias clínicas y el agendamiento eficiente de valoraciones.',
    },
    {
      title: 'Opción de Derivación Jurídica',
      description:
        'Si el cliente no cuenta con abogado representante, ofrecemos la alternativa de acompañamiento jurídico especializado complementario.',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Diferencial Institucional</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Respaldamos su caso con evidencia médica sólida
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              En Alianza Salud Medical Group unimos la práctica médica pericial y el rigor científico para entregar calificaciones de PCLO e Informes Periciales Médicos de máxima confiabilidad.
            </p>
            <div className="mt-8">
              <Link to="/nosotros">
                <Button variant="outline">
                  Conocer sobre la institución
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-base">{benefit.title}</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
