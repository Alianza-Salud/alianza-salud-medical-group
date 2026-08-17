import { Scale, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function LegalSupportSection() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-light">
                <Scale className="h-4 w-4" />
                <span>Servicio Complementario</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                ¿Necesita acompañamiento jurídico para su caso?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Nuestro foco principal es la evaluación médica y la entrega del dictamen pericial. Si durante su proceso requiere orientación o representación legal y aún no cuenta con un abogado, le ofrecemos información sobre nuestras opciones de soporte jurídico complementario.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Soporte si no cuenta con abogado previo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Articulación del dictamen con su representante</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:justify-end">
              <Link to="/citas">
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 border-none font-bold">
                  Agendar valoración inicial
                </Button>
              </Link>
              <Link to="/contacto">
                <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-white/10">
                  Consultar sobre acompañamiento
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
