import { useState, useEffect, type RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook para capturar la posición del ratón en coordenadas relativas a un elemento.
 * Se utiliza en las tarjetas Spotlight en escritorio.
 */
export function useMousePosition(ref: RefObject<HTMLElement | null>): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return mousePosition;
}
