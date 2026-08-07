import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getIconByName } from '../../lib/icons';
import type { ServiceSummary } from '../../types/service';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';

interface ServiceCardProps {
  service: ServiceSummary;
}

/**
 * Card individual de servicio jurídico.
 * Muestra icono, nombre, descripción y CTA.
 */
export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = getIconByName(service.icon);

  return (
    <Card hover className="flex flex-col h-full">
      <CardContent className="flex-1">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconComponent className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {service.shortDescription}
        </p>
      </CardContent>
      <CardFooter>
        <Link to={`/servicios/${service.slug}`} className="w-full">
          <Button variant="ghost" size="sm" className="w-full justify-between text-primary">
            {service.ctaText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
