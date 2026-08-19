import { useEffect, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { Phone, Clock, ShieldCheck } from 'lucide-react';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';
import { Reveal } from '../components/ui/Reveal';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export default function AppointmentsPage() {
  usePageMeta(
    'Agendar Valoración',
    'Solicite su cita de valoración médico-pericial con Alianza Salud Medical Group.'
  );

  const [siteData, setSiteData] = useState<SiteInfoData | null>(null);

  useEffect(() => {
    fetchSiteInfo().then((data) => setSiteData(data));
  }, []);

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <Reveal variant="fadeUp" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Agendamiento Directo de Admisiones</span>
            </div>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Solicitar Valoración Médico-Pericial
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Complete el formulario para coordinar su cita de evaluación médica o dictamen de PCLO. Nuestro equipo de admisiones confirmará su fecha y horario.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Formulario y sidebar */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Formulario */}
            <div className="lg:col-span-8">
              <Reveal variant="fadeUp" delay={200}>
                <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-10 shadow-xl">
                  <AppointmentForm />
                </div>
              </Reveal>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-4">
              <Reveal variant="fadeScale" delay={280}>
                <div className="sticky top-24 space-y-6">
                  
                  {/* Info de contacto */}
                  <SpotlightCard className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Atención directa de admisiones
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      Si prefiere atención directa o asesoría telefónica previa:
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-800">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span>{siteData?.phone || '+57 (604) 444-5566'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-800">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span>{siteData?.schedule || 'Lunes a Viernes: 8:00 AM - 6:00 PM'}</span>
                      </div>
                    </div>
                  </SpotlightCard>

                  {/* Nota de confidencialidad */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-extrabold text-emerald-950">
                          Confidencialidad Médica
                        </p>
                        <p className="mt-1 text-xs text-emerald-800 leading-relaxed font-medium">
                          Toda la información y documentación aportada para su valoración será tratada bajo estricta reserva profesional de acuerdo con la legislación de datos en salud.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
