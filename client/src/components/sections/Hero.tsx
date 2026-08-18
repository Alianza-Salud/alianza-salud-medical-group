import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, HeartPulse, FileSearch, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onOpenModal?: () => void;
}

/**
 * Hero enfocado en Injury Management y Captación de Casos.
 * Plantea el problema directo del usuario con revisión preliminar sin costo.
 */
export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-400 border border-emerald-400/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Injury Management — Manejo Integral de Lesiones</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              ¿Tu accidente te dejó <span className="text-emerald-400">secuelas</span>?
            </h1>

            {/* Subtítulo enfocado en la solución */}
            <p className="mt-6 text-lg leading-relaxed text-slate-200 sm:text-xl">
              Si después de un accidente de tránsito, accidente laboral o atención médica tienes dolor persistente, fracturas, cirugías o limitaciones para trabajar, <strong>realizamos una revisión preliminar de tu caso sin ningún costo</strong>.
            </p>

            {/* Diferenciadores rápidos */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <FileSearch className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Analizamos tus documentos disponibles</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <Stethoscope className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>Orientación técnico-médica especializada</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row items-stretch sm:items-center">
              <Button size="lg" onClick={onOpenModal} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 border-none">
                <UploadCloud className="h-5 w-5" />
                QUIERO QUE REVISEN MI CASO
              </Button>

              <Link to="/citas">
                <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-white/10 w-full sm:w-auto">
                  Agendar valoración
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              * La revisión preliminar es orientativa y sin compromiso. No requiere contratar inmediatamente.
            </p>
          </div>
        </div>
      </div>

      {/* Elemento decorativo */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-primary/20 via-primary/5 to-transparent blur-3xl" />
    </section>
  );
}
