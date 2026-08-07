import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '../../data/process';
import { Button } from '../ui/Button';
import { getIconByName } from '../../lib/icons';

/**
 * Sección resumida del proceso de atención para la página de inicio.
 * Muestra los primeros pasos y enlaza a la página completa.
 */
export function HowItWorks() {
  // Mostrar solo los 4 primeros pasos en el resumen del Home
  const previewSteps = processSteps.slice(0, 4);

  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cómo funciona nuestro proceso
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Le acompañamos paso a paso, desde el primer contacto hasta la
            resolución de su caso.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {previewSteps.map((step, index) => {
            const IconComponent = getIconByName(step.icon);

            return (
              <div key={step.id} className="relative text-center">
                {/* Número de paso */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/proceso">
            <Button variant="outline">
              Ver proceso completo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
