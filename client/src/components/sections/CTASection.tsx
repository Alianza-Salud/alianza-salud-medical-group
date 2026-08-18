import { Link } from 'react-router-dom';
import { ArrowRight, UploadCloud, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface CTASectionProps {
  onOpenModal?: () => void;
}

export function CTASection({ onOpenModal }: CTASectionProps) {
  return (
    <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-4">
          <ShieldCheck className="h-4 w-4" />
          <span>Atención Inmediata & Orientación Médico-Pericial</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          ¿Tu accidente te dejó secuelas?{' '}
          <span className="text-emerald-400 block mt-1">Haz revisar tu caso por profesionales</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Envíanos los documentos disponibles que tengas a la mano. Realizamos una revisión preliminar sin ningún costo ni compromiso y te explicamos el siguiente paso.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center items-stretch sm:items-center max-w-md mx-auto sm:max-w-none">
          <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 border-none"
          >
            <UploadCloud className="h-5 w-5" />
            QUIERO QUE REVISEN MI CASO
          </Button>

          <Link to="/citas">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-200 hover:bg-white/10 hover:text-white w-full sm:w-auto"
            >
              Agendar valoración
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Aviso de Confidencialidad y Alcance */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 max-w-xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Tratamiento estrictamente confidencial de antecedentes médicos conforme a la normatividad vigente.
          </span>
        </div>

      </div>

      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
    </section>
  );
}
