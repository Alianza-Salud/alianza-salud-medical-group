import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getIconByName } from '../../lib/icons';
import type { ServiceSummary } from '../../types/service';
import { Button } from '../ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';

interface ServiceCardProps {
  service: ServiceSummary;
}

/**
 * Card individual de servicio médico-pericial con Spotlight.
 */
export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = getIconByName(service.icon);

  return (
    <SpotlightCard className="flex flex-col justify-between h-full group">
      <div>
        <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
          <IconComponent className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed font-normal">
          {service.shortDescription}
        </p>
      </div>

      <div className="mt-8 pt-5 border-t border-gray-100">
        <Link to={`/servicios/${service.slug}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="group/btn hover:bg-primary hover:text-white hover:border-primary transition-all font-bold justify-between"
          >
            <span>{service.ctaText || 'Ver detalles del servicio'}</span>
            <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </SpotlightCard>
  );
}
