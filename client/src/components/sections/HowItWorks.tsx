import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '../../data/process';
import { Button } from '../ui/Button';
import { getIconByName } from '../../lib/icons';

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20 sm:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Metodología Médico-Pericial</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Proceso de atención y dictamen
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Desde la admisión de antecedentes hasta la entrega oficial del Informe Pericial o calificación de PCLO.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => {
            const IconComponent = getIconByName(step.icon);

            return (
              <div key={step.id} className="relative text-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
                <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/proceso">
            <Button variant="outline">
              Conocer detalles del proceso
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
