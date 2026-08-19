import { useState, useEffect } from 'react';
import { getIconByName } from '../../lib/icons';
import { processSteps } from '../../data/process';
import { cn } from '../../lib/utils';
import { CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SpotlightCard } from '../ui/SpotlightCard';

/**
 * Timeline interactivo con animación de flujo automático de etapas.
 * Cicla activando cada etapa cada 1900ms para mostrar la progresión en tiempo real.
 */
export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 1900);
    return () => clearInterval(timer);
  }, []);

  const activeStepData = processSteps[activeStep];
  const ActiveIcon = getIconByName(activeStepData.icon);

  return (
    <div className="space-y-12">
      
      {/* 1. Indicador de Progreso Horizontal Interactivo (Estilo Ruta de Evaluación Integral) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Ruta en Tiempo Real — Etapa {activeStep + 1} de {processSteps.length}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {activeStepData.title}
          </span>
        </div>

        {/* Nodos de Pasos en Horizontal */}
        <div className="grid gap-3 sm:grid-cols-4 relative z-10">
          {processSteps.map((step, index) => {
            const StepIcon = getIconByName(step.icon);
            const isActive = activeStep === index;
            const isCompleted = index < activeStep;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                  isActive
                    ? 'bg-slate-800/90 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900/30 border-slate-800/50 text-slate-500 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    0{index + 1}
                  </span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </div>
                </div>
                <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {step.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Lista Detallada de Etapas */}
      <div className="relative space-y-6">
        {processSteps.map((step, index) => {
          const IconComponent = getIconByName(step.icon);
          const isActive = activeStep === index;

          return (
            <Reveal key={step.id} variant="fadeUp" delay={index * 80}>
              <SpotlightCard
                onClick={() => setActiveStep(index)}
                className={cn(
                  'transition-all duration-500',
                  isActive
                    ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20 bg-white scale-[1.01]'
                    : 'border-gray-200/90 opacity-90'
                )}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Ícono de etapa */}
                  <div
                    className={cn(
                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-110'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    <IconComponent className="h-7 w-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h3 className={cn('text-lg sm:text-xl font-extrabold', isActive ? 'text-emerald-700' : 'text-gray-900')}>
                        Etapa 0{index + 1}: {step.title}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                          Etapa en Foco
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

    </div>
  );
}
