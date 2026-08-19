import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '../../data/process';
import { Button } from '../ui/Button';
import { getIconByName } from '../../lib/icons';
import { Reveal } from '../ui/Reveal';
import { SpotlightCard } from '../ui/SpotlightCard';

export function HowItWorks() {
  return (
    <section className="bg-gray-50/70 py-20 sm:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Estructurado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Reveal variant="fadeUp" delay={0}>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Metodología Médico-Pericial
            </span>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Proceso transparente de atención en 4 etapas
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base text-gray-600">
              Desde la revisión preliminar de antecedentes hasta la expedición del Informe Pericial oficial o calificación de PCLO.
            </p>
          </Reveal>
        </div>

        {/* Timeline Horizontal Interactivo */}
        <div className="relative">
          {/* Línea conectora de fondo */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-12 h-1 bg-gray-200 z-0 rounded-full" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {processSteps.slice(0, 4).map((step, index) => {
              const IconComponent = getIconByName(step.icon);

              return (
                <Reveal key={step.id} variant="fadeUp" delay={200 + index * 80}>
                  <SpotlightCard className="flex flex-col items-center text-center h-full group hover:border-emerald-500/50">
                    {/* Badge Número de Etapa */}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white shadow-md group-hover:bg-emerald-600 transition-colors mb-4">
                      0{index + 1}
                    </span>

                    {/* Ícono */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-7 w-7" />
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal variant="fadeUp" delay={500} className="mt-12 text-center">
          <Link to="/proceso">
            <Button variant="outline" size="lg" className="font-bold">
              Conocer detalles de cada etapa
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>

      </div>
    </section>
  );
}
