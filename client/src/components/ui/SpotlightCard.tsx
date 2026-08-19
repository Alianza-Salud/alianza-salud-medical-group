import { useRef, type ReactNode } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import { cn } from '../../lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
}

/**
 * Tarjeta interactiva con efecto de luz radial (Spotlight) sutil en escritorio.
 * La tonalidad de la luz se adapta automáticamente al CSS importado (index.css vs index2.css).
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor,
  onClick,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePosition = useMousePosition(containerRef);

  const defaultSpotlight = spotlightColor || 'rgba(14, 165, 233, 0.12)';

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={cn(
        'spotlight-card group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-500/40',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Capa de resplandor Spotlight (solo escritorio) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
        style={{
          background: `radial-gradient(320px circle at ${mousePosition.x}px ${mousePosition.y}px, ${defaultSpotlight}, transparent 80%)`,
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
