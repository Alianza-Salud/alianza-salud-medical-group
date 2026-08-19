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
 * Tarjeta interactiva con efecto de luz radial (Spotlight) en escritorio.
 * Al mover el cursor, proyecta una iluminación sutil que resalta bordes y superficies.
 * En móvil se mantiene limpio y estático para optimizar rendimiento.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(13, 148, 136, 0.12)', // Subtle teal radial glow
  onClick,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePosition = useMousePosition(containerRef);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-500/40',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Capa de resplandor Spotlight (solo escritorio) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
        style={{
          background: `radial-gradient(320px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
