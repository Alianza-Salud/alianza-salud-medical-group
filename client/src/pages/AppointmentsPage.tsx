import { useEffect, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { Phone, Clock, Info } from 'lucide-react';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';

export default function AppointmentsPage() {
  usePageMeta(
    'Agendar Cita',
    'Solicite una cita de evaluación con el equipo jurídico de Alianza Salud Medical Group.'
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
            title="Agendar cita"
            subtitle="Complete el siguiente formulario para solicitar una cita de evaluación. Nos comunicaremos con usted para confirmar la disponibilidad."
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
                    ¿Prefiere contacto directo?
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    También puede comunicarse con nosotros directamente.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>{siteData?.phone || '+57 (601) 555-0199'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>{siteData?.schedule || 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Nota */}
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Importante
                      </p>
                      <p className="mt-1 text-xs text-blue-700 leading-relaxed">
                        La solicitud de cita no garantiza la disponibilidad en la
                        fecha y hora seleccionadas. Nuestro equipo se comunicará
                        para confirmar o proponer alternativas.
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
