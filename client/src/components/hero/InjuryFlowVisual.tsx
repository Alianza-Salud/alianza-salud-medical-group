import { useState, useEffect } from 'react';
import { FileSearch, Stethoscope, FileCheck, Send, CheckCircle2, Activity } from 'lucide-react';

const steps = [
  {
    id: 'analisis',
    title: 'Análisis & Nexo Causal',
    desc: 'Evaluación del evento y relación causa-efecto.',
    icon: FileSearch,
    color: 'emerald',
  },
  {
    id: 'valoracion',
    title: 'Valoración Médica',
    desc: 'Estudio de secuelas y capacidad funcional.',
    icon: Stethoscope,
    color: 'teal',
  },
  {
    id: 'informe',
    title: 'Informe Pericial',
    desc: 'Sustento técnico-científico riguroso.',
    icon: FileCheck,
    color: 'blue',
  },
  {
    id: 'entrega',
    title: 'Entrega de Resultados',
    desc: 'Dictamen oficial listo para reclamación.',
    icon: Send,
    color: 'indigo',
  },
];

/**
 * Componente gráfico interactivo de la ruta de Injury Management.
 * Ilustra visualmente el flujo de caso con nodos de estado y pulsos ambientales.
 */
export function InjuryFlowVisual() {
  const [activeStep, setActiveStep] = useState(0);

  // Ciclo automático sutil para animar el proceso visualmente
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl border border-slate-700/60 bg-slate-900/90 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

      {/* Header del Visualizador */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ruta de Evaluación Integral
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          EN PROCESO
        </span>
      </div>

      {/* Diagrama de Nodos y Conectores */}
      <div className="space-y-3.5 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isCompleted = idx < activeStep;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`group flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/40 translate-x-1'
                  : isCompleted
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40'
              }`}
            >
              {/* Ícono de Estado */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-105'
                    : isCompleted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>

              {/* Contenido del Nodo */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    0{idx + 1}. {step.title}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug truncate">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie de diagrama */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Criterios técnicos rigurosos</span>
        <span className="font-semibold text-emerald-400">PCLO & Dictámenes</span>
      </div>
    </div>
  );
}
