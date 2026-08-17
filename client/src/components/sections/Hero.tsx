import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, HeartPulse, FileCheck } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Hero principal enfocado en servicios médico-periciales.
 * PCLO e Informe Pericial Médico con soporte jurídico complementario.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Stethoscope className="h-4 w-4" />
              <span>Servicios Médicos Especializados & Peritaje</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Evaluación médico-pericial{' '}
              <span className="text-primary">especializada</span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              En Alianza Salud Medical Group realizamos calificaciones de Pérdida de Capacidad Laboral y Ocupacional (PCLO) e informes médicos periciales con rigor científico, respaldando a personas afectadas por accidentes de tránsito, accidentes laborales o negligencia y responsabilidad médica.
            </p>

            {/* Diferenciadores */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HeartPulse className="h-5 w-5 text-primary" />
                <span>Dictámenes con sustento técnico-médico</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileCheck className="h-5 w-5 text-primary" />
                <span>Opción de acompañamiento jurídico complementario</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/citas">
                <Button size="lg">
                  Solicitar valoración médica
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/servicios">
                <Button variant="outline" size="lg">
                  Ver PCLO e Informes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Elemento decorativo */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent" />
    </section>
  );
}
