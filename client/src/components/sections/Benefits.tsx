import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Sección de beneficios/diferenciales de la página de inicio.
 * Explica la articulación entre el área jurídica y médica.
 */
export function Benefits() {
  const benefits = [
    {
      title: 'Equipo interdisciplinario',
      description:
        'Nuestro equipo combina profesionales del área jurídica y especialistas médicos para ofrecer un análisis integral de cada caso.',
    },
    {
      title: 'Respaldo médico especializado',
      description:
        'Contamos con el área de especialidades en salud de Alianza Salud Medical Group para obtener conceptos, valoraciones y dictámenes médicos.',
    },
    {
      title: 'Atención personalizada',
      description:
        'Cada caso es único. Brindamos una evaluación personalizada y definimos una ruta de atención acorde a su situación particular.',
    },
    {
      title: 'Acompañamiento integral',
      description:
        'Desde la evaluación inicial hasta la resolución, le acompañamos en cada etapa del proceso con comunicación transparente.',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Texto principal */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Por qué elegir Alianza Salud Medical Group?
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Somos una organización que integra servicios jurídicos y de salud,
              lo que nos permite ofrecer un enfoque diferenciador en el análisis
              y acompañamiento de casos donde convergen aspectos legales y médicos.
            </p>
            <div className="mt-8">
              <Link to="/nosotros">
                <Button variant="outline">
                  Conocer más sobre nosotros
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid de beneficios */}
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-100 bg-gray-50 p-5"
              >
                <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
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
