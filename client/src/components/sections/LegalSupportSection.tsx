import { Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function LegalSupportSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="fadeUp" delay={0}>
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden border border-slate-800">
            
            {/* Luz ambiental sutil */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/20">
                  <Scale className="h-4 w-4" />
                  <span>Servicio Complementario</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  ¿Necesita acompañamiento jurídico para su caso?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Nuestro foco principal es la evaluación médica y la entrega del dictamen pericial. Si durante su proceso requiere orientación o representación legal y aún no cuenta con un abogado, le ofrecemos soporte jurídico complementario.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Soporte si no cuenta con abogado previo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Articulación del dictamen con su representante</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-end">
                <Link to="/citas">
                  <Button size="lg" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none shadow-lg shadow-emerald-500/20">
                    Agendar valoración inicial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button variant="outline" size="lg" className="w-full border-slate-700 text-white hover:bg-white/10 font-semibold">
                    Consultar acompañamiento
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
