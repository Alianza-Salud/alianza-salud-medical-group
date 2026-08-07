import { getIconByName } from '../../lib/icons';
import { processSteps } from '../../data/process';
import { cn } from '../../lib/utils';

/**
 * Timeline visual del proceso completo de atención.
 * Representación vertical en mobile, horizontal en desktop.
 */
export function ProcessTimeline() {
  return (
    <div className="relative">
      {processSteps.map((step, index) => {
        const IconComponent = getIconByName(step.icon);
        const isLast = index === processSteps.length - 1;

        return (
          <div key={step.id} className="relative flex gap-6 pb-12 last:pb-0">
            {/* Línea vertical */}
            {!isLast && (
              <div className="absolute left-6 top-14 h-[calc(100%-3.5rem)] w-px bg-gray-200" />
            )}

            {/* Icono con número */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white',
                  'border-primary text-primary'
                )}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {step.id}
              </span>
            </div>

            {/* Contenido */}
            <div className="pt-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-1 text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
