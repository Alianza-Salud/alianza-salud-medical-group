import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, HeartPulse, Scale, Users, Target, Eye, Award, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';

export default function AboutPage() {
  usePageMeta(
    'Nosotros',
    'Conozca Alianza Salud Medical Group — Organización especializada en evaluaciones médico-periciales y dictámenes de PCLO en Medellín, Colombia.'
  );

  const [siteInfo, setSiteInfo] = useState<SiteInfoData | null>(null);

  useEffect(() => {
    fetchSiteInfo().then((data) => setSiteInfo(data));
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
              <span>Institución Médico-Pericial</span>
            </div>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Sobre {siteInfo?.company_name || 'Alianza Salud Medical Group'}
            </h1>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              {siteInfo?.tagline || 'Organización especializada en el acompañamiento e investigación médico-pericial con estricto respaldo técnico-científico.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Presentación e Información Institucional */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <Reveal variant="fadeUp" delay={0}>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  Quiénes somos
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2 sm:text-4xl">
                  Evaluación Médica de Lesiones & Peritaje
                </h2>
              </Reveal>

              <Reveal variant="fadeUp" delay={100}>
                <p className="text-base text-gray-600 leading-relaxed">
                  <strong>{siteInfo?.company_name || 'Alianza Salud Medical Group'}</strong> es una organización con sede en Medellín, Colombia, orientada a la prestación de servicios de evaluación médica especializada, peritaje médico-legal y <strong>Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)</strong>.
                </p>
              </Reveal>

              <Reveal variant="fadeUp" delay={180}>
                <p className="text-base text-gray-600 leading-relaxed">
                  Brindamos soporte a personas naturales, firmas de abogados e instituciones que requieren la determinación técnica del porcentaje de discapacidad, secuelas corporales o evaluación de nexo causal en lesiones por accidentes de tránsito, accidentes laborales o responsabilidad médica.
                </p>
              </Reveal>
              
              <Reveal variant="fadeUp" delay={260}>
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5 border-l-4 border-l-emerald-600">
                  <p className="text-xs sm:text-sm text-emerald-950 font-medium italic leading-relaxed">
                    {siteInfo?.history || 'Fundada para responder a las necesidades de dictámenes médicos periciales rigurosos, Alianza Salud integra la práctica clínica pericial con la gestión de admisiones eficientes.'}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Recurso visual institucional */}
            <div className="lg:col-span-6">
              <Reveal variant="fadeScale" delay={200}>
                {siteInfo?.visual_resource && (siteInfo.visual_resource.startsWith('/') || siteInfo.visual_resource.startsWith('http') || siteInfo.visual_resource.startsWith('data:')) ? (
                  <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-slate-900 shadow-2xl transition-all duration-300 hover:shadow-2xl">
                    <img
                      src={siteInfo.visual_resource}
                      alt="Recurso Visual Institucional — Alianza Salud Medical Group"
                      className="h-80 sm:h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-8 flex flex-col justify-end">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                        Alianza Salud Medical Group
                      </span>
                      <p className="text-lg font-bold text-white mt-1 drop-shadow-xs">
                        Instalaciones & Servicios Médicos Periciales
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center shadow-xs">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      <Users className="h-12 w-12" />
                    </div>
                    <p className="text-sm text-gray-600 font-semibold italic">
                      {siteInfo?.visual_resource || 'Alianza Salud Medical Group — Medellín, Colombia'}
                    </p>
                  </div>
                )}
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="bg-gray-50/70 py-16 sm:py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Misión */}
            <Reveal variant="fadeUp" delay={0}>
              <SpotlightCard className="h-full">
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-2">Misión</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {siteInfo?.mission || 'Brindar evaluaciones médico-periciales y calificaciones de PCLO objetivas con altos estándares de ética y rigor científico.'}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Visión */}
            <Reveal variant="fadeUp" delay={120}>
              <SpotlightCard className="h-full">
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-2">Visión</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {siteInfo?.vision || 'Ser el centro de peritaje médico y PCLO de mayor confiabilidad y liderazgo técnico en Colombia.'}
                </p>
              </SpotlightCard>
            </Reveal>

            {/* Valores */}
            <Reveal variant="fadeUp" delay={240}>
              <SpotlightCard className="h-full">
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-3">Valores Institucionales</h3>
                <ul className="space-y-2">
                  {(siteInfo?.values && siteInfo.values.length > 0
                    ? siteInfo.values
                    : ['Rigor científico', 'Independencia pericial', 'Empatía y ética', 'Transparencia', 'Calidad en admisiones']
                  ).map((val, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-gray-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {val}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Reveal variant="fadeUp" delay={0}>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ¿Deseas solicitar una revisión preliminar o valoración?
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={100}>
            <p className="text-base text-gray-600">
              Comunícate con nuestra unidad de admisiones o agenda tu valoración especializada.
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={180}>
            <div className="pt-4 flex justify-center gap-4">
              <Link to="/citas">
                <Button size="lg" className="font-bold">
                  Agendar valoración <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
