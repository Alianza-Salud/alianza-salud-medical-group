import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { processSteps } from '../../data/process';
import { Button } from '../ui/Button';
import { getIconByName } from '../../lib/icons';
import { Reveal } from '../ui/Reveal';

export function HowItWorks() {
  const [focusedStep, setFocusedStep] = useState(0);
  const stepsToShow = processSteps.slice(0, 4);

  // Animación de focus uno a uno de las cartas de las etapas
  useEffect(() => {
    const timer = setInterval(() => {
      setFocusedStep((prev) => (prev + 1) % stepsToShow.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [stepsToShow.length]);

  return (
    <section className="bg-gray-50/70 py-20 sm:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Estructurado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Reveal variant="fadeUp" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-extrabold text-primary border border-primary/20">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Metodología Médico-Pericial</span>
            </div>
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

        {/* Grid de Cartas con Animación de Focus Escalonado */}
        <div className="relative">
          {/* Línea conectora de fondo */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 -translate-y-12 h-1 bg-gray-200 z-0 rounded-full" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {stepsToShow.map((step, index) => {
              const IconComponent = getIconByName(step.icon);
              const isFocused = focusedStep === index;

              return (
                <Reveal key={step.id} variant="fadeUp" delay={200 + index * 80}>
                  <div
                    onClick={() => setFocusedStep(index)}
                    className={`relative rounded-3xl p-6 transition-all duration-500 cursor-pointer flex flex-col items-center text-center h-full bg-white border ${
                      isFocused
                        ? 'border-emerald-500 shadow-2xl shadow-emerald-600/20 ring-4 ring-emerald-500/20 -translate-y-2 scale-[1.03]'
                        : 'border-gray-200/90 shadow-2xs hover:border-gray-300 opacity-90'
                    }`}
                  >
                    {/* Badge Número de Etapa */}
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-black transition-all duration-300 mb-4 ${
                        isFocused
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-110'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      0{index + 1}
                    </span>

                    {/* Ícono */}
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                        isFocused
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <IconComponent className="h-7 w-7" />
                    </div>

                    <h3 className={`font-extrabold text-base mb-2 transition-colors ${isFocused ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {step.description}
                    </p>

                    {/* Badge "ETAPA ACTIVA" cuando está enfocado */}
                    {isFocused && (
                      <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Etapa Activa
                      </span>
                    )}
                  </div>
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
