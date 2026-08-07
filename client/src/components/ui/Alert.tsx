import { cn } from '../../lib/utils';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

type AlertVariant = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  className?: string;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClass: 'text-amber-500',
  },
};

/**
 * Componente de alerta reutilizable con variantes y opción de cerrar.
 */
export function Alert({
  variant,
  title,
  message,
  dismissible = false,
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        config.containerClass,
        className
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconClass)} />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className={cn(title && 'mt-1', 'text-sm')}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
          aria-label="Cerrar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
