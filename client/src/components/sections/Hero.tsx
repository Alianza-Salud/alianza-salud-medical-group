import { Link } from 'react-router-dom';
import { ArrowRight, Shield, HeartPulse } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Hero principal de la página de inicio.
 * Comunica rápidamente la propuesta de valor:
 * acompañamiento jurídico especializado con respaldo médico.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              <span>Consultoría jurídica con respaldo médico</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Acompañamiento jurídico{' '}
              <span className="text-primary">especializado</span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              En Alianza Salud Medical Group integramos servicios jurídicos y
              especialidades en salud para brindarle un acompañamiento integral
              en casos de responsabilidad médica, accidentes de tránsito y otros
              servicios jurídicos relacionados.
            </p>

            {/* Diferenciadores */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HeartPulse className="h-5 w-5 text-primary" />
                <span>Respaldo de especialistas médicos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-primary" />
                <span>Evaluación integral de cada caso</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/citas">
                <Button size="lg">
                  Solicitar asesoría
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/servicios">
                <Button variant="outline" size="lg">
                  Conocer servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Elemento decorativo sutil */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent" />
    </section>
  );
}
