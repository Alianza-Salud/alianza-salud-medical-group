import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/utils';

export type RevealVariant = 'fadeUp' | 'fadeScale' | 'blurReveal' | 'slideRight' | 'slideLeft';

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number; // en ms (ej: 0, 80, 160, 240)
  duration?: number; // en ms (ej: 500)
  className?: string;
  triggerOnce?: boolean;
}

/**
 * Componente contenedor reutilizable para Scroll Reveal.
 * Aplica animaciones predecibles y escalonadas (stagger) respetando accesibilidad.
 */
export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 500,
  className = '',
  triggerOnce = true,
}: RevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ triggerOnce, threshold: 0.12 });

  const getVariantStyles = () => {
    switch (variant) {
      case 'fadeScale':
        return isInView
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-[0.96] pointer-events-none';
      case 'blurReveal':
        return isInView
          ? 'opacity-100 blur-none translate-y-0'
          : 'opacity-0 blur-md translate-y-4 pointer-events-none';
      case 'slideRight':
        return isInView
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-6 pointer-events-none';
      case 'slideLeft':
        return isInView
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-6 pointer-events-none';
      case 'fadeUp':
      default:
        return isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6 pointer-events-none';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={cn('transition-all', getVariantStyles(), className)}
    >
      {children}
    </div>
  );
}
