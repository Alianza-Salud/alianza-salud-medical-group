import type { ServiceSummary } from '../../types/service';
import { ServiceCard } from './ServiceCard';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/utils';

interface ServiceGridProps {
  services: ServiceSummary[];
  className?: string;
}

/**
 * Grid de servicios jurídicos.
 * Muestra una cuadrícula responsive de ServiceCards.
 */
export function ServiceGrid({ services, className }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        title="No hay servicios disponibles"
        description="Los servicios serán publicados próximamente."
      />
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
