import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, FileSearch, ShieldCheck, UploadCloud, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { InjuryFlowVisual } from '../hero/InjuryFlowVisual';

interface HeroProps {
  onOpenModal?: () => void;
}

/**
 * Hero enfocado en Injury Management y Captación de Casos.
 * Incorpora revelación escalonada (stagger), nodos animados de Injury Management y gradientes ambientales.
 */
export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary-dark text-white pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Luz ambiental en gradientes radiales imperceptibles */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-float-ambient" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none animate-float-ambient" style={{ animationDelay: '3.5s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Columna Izquierda: Mensaje & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow */}
            <Reveal variant="fadeUp" delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-400 border border-emerald-500/20 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Injury Management — Manejo Integral de Lesiones</span>
              </div>
            </Reveal>

            {/* Título Principal H1 con Blur Reveal */}
            <Reveal variant="blurReveal" delay={80}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                ¿Tu accidente te dejó <span className="text-emerald-400">secuelas</span>?
              </h1>
            </Reveal>

            {/* Descripción */}
            <Reveal variant="fadeUp" delay={160}>
              <p className="text-base sm:text-xl leading-relaxed text-slate-300 font-normal">
                Si después de un accidente de tránsito, accidente laboral o atención médica sufres de dolor persistente, cirugías o limitaciones laborales, <strong>estudiamos tu caso preliminarmente sin costo</strong>.
              </p>
            </Reveal>

            {/* Diferenciadores Clave */}
            <Reveal variant="fadeUp" delay={240}>
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <FileSearch className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200 font-semibold">Análisis de documentos disponibles</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Stethoscope className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200 font-semibold">Dictámenes técnicos especializados</span>
                </div>
              </div>
            </Reveal>

            {/* Acciones principales */}
            <Reveal variant="fadeUp" delay={320}>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Button
                  size="lg"
                  onClick={onOpenModal}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-xl shadow-emerald-500/25 border-none transform hover:-translate-y-0.5 transition-transform"
                >
                  <UploadCloud className="h-5 w-5" />
                  QUIERO QUE REVISEN MI CASO
                </Button>

                <Link to="/citas">
                  <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-white/10 w-full sm:w-auto">
                    Agendar valoración
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                * La revisión preliminar es orientativa y sin ningún compromiso legal o económico.
              </p>
            </Reveal>
          </div>

          {/* Columna Derecha: Diagrama de Proceso Injury Flow Visual */}
          <div className="lg:col-span-5">
            <Reveal variant="fadeScale" delay={200}>
              <InjuryFlowVisual />
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
