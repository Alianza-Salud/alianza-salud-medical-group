import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { ContactForm } from '../components/forms/ContactForm';
import { Button } from '../components/ui/Button';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';
import { Reveal } from '../components/ui/Reveal';
import { SpotlightCard } from '../components/ui/SpotlightCard';

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
      label: 'Teléfono Directo',
      value: siteData?.phone || '+57 (604) 444-5566',
      description: 'Llámenos para orientación o admisiones',
    },
    {
      icon: Mail,
      label: 'Correo Electrónico',
      value: siteData?.email || 'contacto@alianzasalud.com',
      description: 'Escríbanos para consultas generales',
    },
    {
      icon: MapPin,
      label: 'Sede Principal',
      value: siteData?.address || 'Medellín, Antioquia — Colombia',
      description: 'Atención presencial especializada',
    },
    {
      icon: Clock,
      label: 'Horario de Atención',
      value: siteData?.schedule || 'Lunes a Viernes: 8:00 AM - 6:00 PM',
      description: 'Horario de admisiones al público',
    },
  ];

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <Reveal variant="fadeUp" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Canales Directos de Atención</span>
            </div>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Contacto & Atención al Cliente
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              ¿Tiene alguna pregunta o requiere orientación previa? Comuníquese con nuestra unidad de admisiones a través de cualquiera de nuestros canales oficiales.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            
            {/* Info de contacto */}
            <div className="lg:col-span-4 space-y-6">
              <Reveal variant="fadeUp" delay={200}>
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">
                  Información de contacto
                </h2>
                <div className="space-y-4">
                  {contactItems.map((item, idx) => (
                    <SpotlightCard key={item.label} className="p-4 shadow-2xs">
                      <div className="flex gap-4 items-start">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-gray-900">{item.label}</p>
                          <p className="text-sm font-bold text-primary mt-0.5">{item.value}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>

                {/* CTA cita */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-6 mt-6">
                  <h3 className="font-bold text-gray-900 text-sm">
                    ¿Prefiere agendar una cita directa?
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">
                    Puede solicitar su valoración médica de manera directa en el portal.
                  </p>
                  <Link to="/citas" className="block mt-4">
                    <Button variant="outline" size="sm" fullWidth className="font-bold">
                      Agendar valoración
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Formulario de contacto */}
            <div className="lg:col-span-8">
              <Reveal variant="fadeScale" delay={280}>
                <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-10 shadow-xl">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                    Envíenos un mensaje
                  </h2>
                  <ContactForm />
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
