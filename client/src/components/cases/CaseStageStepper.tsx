import { Check, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CASE_STAGES = [
  'Evaluación Inicial',
  'Revisión de Historia Clínica',
  'Dictamen Médico Científico',
  'Conciliación / Reconciliación',
  'Proceso Judicial / Demanda',
  'Resolución y Cierre',
];

interface CaseStageStepperProps {
  currentStage: string;
  onStageChange?: (newStage: string) => void;
  interactive?: boolean;
}

export function CaseStageStepper({
  currentStage,
  onStageChange,
  interactive = false,
}: CaseStageStepperProps) {
  const currentIndex = CASE_STAGES.findIndex(
    (s) => s.toLowerCase() === currentStage.toLowerCase()
  );

  const activeIdx = currentIndex >= 0 ? currentIndex : 0;
  
  // El porcentaje solo aumenta tras PASAR una etapa.
  // En Etapa 1 (índice 0): 0 completadas = 0%
  // En Etapa 6 (índice 5): 5 completadas = 100%
  const completedStages = activeIdx;
  const totalTransitions = CASE_STAGES.length - 1;
  const progressPercent = Math.min(100, Math.round((completedStages / totalTransitions) * 100));

  return (
    <div className="space-y-4">
      {/* Header Progreso */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-gray-500 uppercase tracking-wider">Etapa del Caso ({activeIdx + 1} de {CASE_STAGES.length})</span>
        <span className="text-primary font-mono">{progressPercent}% Completado</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper visual */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
        {CASE_STAGES.map((stage, idx) => {
          const isPassed = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <button
              key={stage}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onStageChange && onStageChange(stage)}
              className={cn(
                'flex flex-col items-center p-2.5 rounded-lg border text-center transition-all',
                interactive && 'cursor-pointer hover:border-primary/50',
                !interactive && 'cursor-default',
                isCurrent && 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary',
                isPassed && 'border-green-200 bg-green-50 text-green-800',
                !isPassed && !isCurrent && 'border-gray-200 bg-gray-50 text-gray-400'
              )}
            >
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold mb-1.5',
                  isPassed && 'bg-green-600 text-white',
                  isCurrent && 'bg-primary text-white',
                  !isPassed && !isCurrent && 'bg-gray-300 text-gray-600'
                )}
              >
                {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium leading-tight',
                  isCurrent && 'text-primary font-bold',
                  isPassed && 'text-green-900',
                  !isPassed && !isCurrent && 'text-gray-500'
                )}
              >
                {stage}
              </span>
              {isCurrent && (
                <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] text-primary font-semibold">
                  <Clock className="h-2.5 w-2.5" /> Activa
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
