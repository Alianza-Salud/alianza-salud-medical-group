import { useState } from 'react';
import { UploadCloud, ShieldCheck, Sparkles } from 'lucide-react';

interface FloatingCaseReviewButtonProps {
  onClick: () => void;
}

/**
 * Botón circular flotante (FAB) de alta definición UX/UI.
 * Permanece fijo en la esquina inferior derecha durante el scroll.
 * Muestra la etiqueta informativa posicionado sobre el botón principal.
 */
export function FloatingCaseReviewButton({ onClick }: FloatingCaseReviewButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 sm:bottom-8 sm:right-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Etiqueta flotante informativa en modo escritorio (posicionada SOBRE el botón) */}
      <div
        className={`hidden sm:flex items-center gap-2 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 shadow-2xl border border-slate-700/60 transition-all duration-300 transform origin-bottom-right ${
          isHovered
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-95 translate-y-1 scale-95 hover:opacity-100'
        }`}
      >
        <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="text-xs font-bold whitespace-nowrap tracking-wide">
          ¿Tu accidente te dejó secuelas?
        </span>
        <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
          Sin Costo
        </span>
      </div>

      {/* Botón Principal Flotante (FAB) */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Quiero que revisen mi caso - Revisión médica preliminar sin costo"
        className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-3.5 sm:p-4 text-white shadow-2xl shadow-emerald-900/40 border border-emerald-300/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Anillo exterior con pulso sutil */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 blur-md animate-pulse group-hover:bg-emerald-400/60 transition-all" />

        {/* Badge "GRATIS" en esquina superior */}
        <span className="absolute -top-1.5 -right-1.5 flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 uppercase tracking-tighter shadow-md border border-amber-200 animate-bounce">
          GRATIS
        </span>

        {/* Icono de Acción */}
        <div className="relative flex items-center justify-center">
          <UploadCloud className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* Texto del botón (visible tanto en móvil como en escritorio) */}
        <span className="relative font-bold text-xs sm:text-sm tracking-tight pr-1 inline-block whitespace-nowrap">
          Quiero que revisen mi caso
        </span>

        {/* Indicador de insignia médica */}
        <div className="relative hidden lg:flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
          <span>Peritaje</span>
        </div>
      </button>
    </div>
  );
}
