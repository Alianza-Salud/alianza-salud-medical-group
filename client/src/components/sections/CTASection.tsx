import { Link } from 'react-router-dom';
import { ArrowRight, UploadCloud, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface CTASectionProps {
  onOpenModal?: () => void;
}

export function CTASection({ onOpenModal }: CTASectionProps) {
  return (
    <section className="bg-slate-950 text-white py-16 sm:py-24 relative overflow-hidden border-t border-slate-800">
      
      {/* Luces radiales ambientales de fondo */}
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none animate-float-ambient" />
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal-500/15 blur-[100px] pointer-events-none animate-float-ambient" style={{ animationDelay: '3s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <Reveal variant="fadeUp" delay={0}>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-4 shadow-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Atención Inmediata & Orientación Médico-Pericial</span>
          </div>
        </Reveal>

        <Reveal variant="blurReveal" delay={80}>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl max-w-4xl mx-auto leading-tight">
            ¿Tu accidente te dejó secuelas?{' '}
            <span className="text-emerald-400 block mt-1">Haz revisar tu caso por profesionales</span>
          </h2>
        </Reveal>

        <Reveal variant="fadeUp" delay={160}>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Envíanos los documentos disponibles que tengas a la mano. Realizamos una revisión preliminar sin ningún costo ni compromiso y te explicamos el siguiente paso.
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={240}>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center items-stretch sm:items-center max-w-md mx-auto sm:max-w-none">
            <Button
              size="lg"
              onClick={onOpenModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-xl shadow-emerald-500/25 border-none transform hover:-translate-y-0.5 transition-transform"
            >
              <UploadCloud className="h-5 w-5" />
              QUIERO QUE REVISEN MI CASO
            </Button>

            <Link to="/citas">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-200 hover:bg-white/10 hover:text-white w-full sm:w-auto font-bold"
              >
                Agendar valoración
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Aviso de Confidencialidad y Alcance */}
        <Reveal variant="fadeUp" delay={320}>
          <div className="mt-10 pt-6 border-t border-slate-800/80 max-w-xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>
              Tratamiento estrictamente confidencial de antecedentes médicos conforme a la normatividad vigente.
            </span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
