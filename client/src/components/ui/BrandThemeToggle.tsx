import { useBrandTheme } from '../../context/BrandThemeContext';
import { Palette, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente flotante / discreto para alternar entre los estilos visuales:
 * 1. 'emerald-pure': Verde Esmeralda Médico Puro
 * 2. 'corporate-brand': Familia Corporativa (Verde + Acentos Sky Blue, Teal & Amber de alianzamedical.co)
 */
export function BrandThemeToggle() {
  const { theme, setTheme } = useBrandTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-pointer"
        title="Cambiar paleta visual de marca"
        aria-label="Cambiar estilo de color de marca"
      >
        <Palette className="h-3.5 w-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Paleta:</span>
        <span className="text-emerald-700 font-extrabold">
          {theme === 'emerald-pure' ? 'Verde Esmeralda' : 'Familia Corporativa'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-10 z-50 w-72 rounded-2xl bg-white border border-gray-200 p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Estilo Visual de Marca
              </span>
            </div>

            {/* Opción 1: Verde Esmeralda Puro */}
            <button
              type="button"
              onClick={() => {
                setTheme('emerald-pure');
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                theme === 'emerald-pure'
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-2xs font-bold'
                  : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                {theme === 'emerald-pure' ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold">Verde Esmeralda Puro</p>
                <p className="text-[11px] text-gray-500 font-normal leading-tight mt-0.5">
                  Paleta original esmeralda médica limpia.
                </p>
              </div>
            </button>

            {/* Opción 2: Familia Corporativa */}
            <button
              type="button"
              onClick={() => {
                setTheme('corporate-brand');
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                theme === 'corporate-brand'
                  ? 'border-sky-500 bg-sky-50/70 text-sky-950 shadow-2xs font-bold'
                  : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white mt-0.5">
                {theme === 'corporate-brand' ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold flex items-center gap-1">
                  <span>Familia Corporativa</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">Acentos</span>
                </p>
                <p className="text-[11px] text-gray-500 font-normal leading-tight mt-0.5">
                  Incorpora acentos Sky Blue (#0ea5e9), Teal y Amber para alinearse con alianzamedical.co.
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
