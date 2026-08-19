import type { ServiceSummary } from '../../types/service';
import { ServiceCard } from './ServiceCard';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/utils';

interface ServiceGridProps {
  services: ServiceSummary[];
  className?: string;
}

/**
 * Grid de servicios médico-periciales.
 * Adapta dinámicamente el ancho y columnas (2 columnas centradas cuando existen 2 servicios).
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

  const isTwoServices = services.length === 2;

  return (
    <div
      className={cn(
        'grid gap-8',
        isTwoServices
          ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
