import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ContactForm } from '../components/forms/ContactForm';
import { Button } from '../components/ui/Button';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';

export default function ContactPage() {
  usePageMeta(
    'Contacto',
    'Comuníquese con Alianza Salud Medical Group. Formulario de contacto, teléfono y ubicación.'
  );

  const [siteData, setSiteData] = useState<SiteInfoData | null>(null);

  useEffect(() => {
    fetchSiteInfo().then((data) => setSiteData(data));
  }, []);

  const contactItems = [
    {
      icon: Phone,
      label: 'Teléfono',
      value: siteData?.phone || '+57 (601) 555-0199',
      description: 'Llámenos para una atención inmediata',
    },
    {
      icon: Mail,
      label: 'Correo electrónico',
      value: siteData?.email || 'contacto@alianzasalud.com',
      description: 'Escríbanos para consultas generales',
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: siteData?.address || 'Carrera 15 # 93-47, Oficina 502, Bogotá D.C.',
      description: 'Nuestra sede principal',
    },
    {
      icon: Clock,
      label: 'Horario de atención',
      value: siteData?.schedule || 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM',
      description: 'Horario de atención al público',
    },
  ];

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Contacto"
            subtitle="¿Tiene alguna pregunta o necesita orientación? Estamos aquí para ayudarle. Comuníquese con nosotros a través de cualquiera de nuestros canales."
          />
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Info de contacto */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Información de contacto
              </h2>
              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA cita */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 mt-8">
                <h3 className="font-semibold text-gray-900">
                  ¿Prefiere agendar una cita?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Puede solicitar directamente una cita de evaluación.
                </p>
                <Link to="/citas" className="block mt-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Agendar cita
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Envíenos un mensaje
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
