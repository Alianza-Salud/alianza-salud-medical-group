import { useScrollProgress } from '../../hooks/useScrollProgress';

/**
 * Componente de barra de progreso de scroll superior.
 * Grosor discreto de 2.5px con gradiente suave que no compite con el contenido.
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-primary transition-all duration-150 ease-out shadow-xs"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
