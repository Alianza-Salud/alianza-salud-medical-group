import { useEffect, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { Phone, Clock, Info, ShieldCheck } from 'lucide-react';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';

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
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Solicitar valoración médico-pericial"
            subtitle="Complete el formulario para agendar su cita de evaluación médica o dictamen de PCLO. Nuestro equipo de admisiones confirmará su fecha y horario."
          />
        </div>
      </section>

      {/* Formulario y sidebar */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <AppointmentForm />
              </div>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Info de contacto */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Atención directa de admisiones
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Si prefiere atención directa o asesoría telefónica previa:
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{siteData?.phone || '+57 (604) 444-5566'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>{siteData?.schedule || 'Lunes a Viernes: 8:00 AM - 6:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Nota de confidencialidad */}
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Confidencialidad Médica
                      </p>
                      <p className="mt-1 text-xs text-blue-700 leading-relaxed">
                        Toda la información y documentación aportada para su valoración será tratada bajo estricta reserva profesional de acuerdo con la legislación de datos en salud.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
