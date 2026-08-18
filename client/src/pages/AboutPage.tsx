import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, HeartPulse, Scale, Users, Target, Eye, Award } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
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
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={`Sobre ${siteInfo?.company_name || 'Alianza Salud Medical Group'}`}
            subtitle={siteInfo?.tagline || 'Organización especializada en el acompañamiento e investigación médico-pericial con respaldo técnico-científico.'}
          />
        </div>
      </section>

      {/* Presentación e Información Institucional */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Quiénes somos
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {siteInfo?.company_name || 'Alianza Salud Medical Group'} es una organización con sede en Medellín, Colombia, orientada a la prestación de servicios de evaluación médica especializada, peritaje médico-legal y **Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)**.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Brindamos soporte a personas naturales, firmas de abogados e instituciones que requieren la determinación técnica del porcentaje de discapacidad, secuelas corporales o la evaluación de nexo causal en lesiones por accidentes de tránsito, accidentes laborales o responsabilidad médica.
              </p>
              
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
                <p className="text-sm text-gray-600 italic">
                  {siteInfo?.history || 'Fundada para responder a las necesidades de dictámenes médicos periciales rigurosos, Alianza Salud integra la práctica clínica pericial con la gestión de admisiones eficientes.'}
                </p>
              </div>
            </div>

            {/* Recurso visual institucional */}
            {siteInfo?.visual_resource && (siteInfo.visual_resource.startsWith('/') || siteInfo.visual_resource.startsWith('http') || siteInfo.visual_resource.startsWith('data:')) ? (
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                <img
                  src={siteInfo.visual_resource.startsWith('/') ? `http://localhost:3001${siteInfo.visual_resource}` : siteInfo.visual_resource}
                  alt="Recurso Visual Institucional — Alianza Salud Medical Group"
                  className="h-80 sm:h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Alianza Salud Medical Group
                  </span>
                  <p className="text-sm font-semibold text-white mt-1 drop-shadow-xs">
                    Unidad Médico-Pericial & Gestión de Admisiones — Medellín, Colombia
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center shadow-sm">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-14 w-14" />
                </div>
                <p className="text-sm text-gray-600 font-semibold italic">
                  {siteInfo?.visual_resource || 'Alianza Salud Medical Group — Medellín, Colombia'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Misión */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Misión</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {siteInfo?.mission || 'Brresar evaluaciones médico-periciales y calificaciones de PCLO objetivas con altos estándares de ética y rigor científico.'}
              </p>
            </div>

            {/* Visión */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Visión</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {siteInfo?.vision || 'Ser el centro de peritaje médico y PCLO de mayor confiabilidad y liderazgo técnico en Colombia.'}
              </p>
            </div>

            {/* Valores */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 md:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Valores Institucionales</h3>
              <ul className="mt-3 space-y-2">
                {(siteInfo?.values && siteInfo.values.length > 0
                  ? siteInfo.values
                  : ['Rigor científico', 'Independencia pericial', 'Empatía y ética', 'Transparencia', 'Calidad en admisiones']
                ).map((val, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {val}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Estructura Operativa */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Estructura Operativa"
            subtitle="La coordinación entre el área médico-pericial, la unidad de admisiones y la opción de soporte jurídico complementario."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Peritaje Médico */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unidad Médico-Pericial
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Médicos especialistas y peritos encargados del estudio de historias clínicas, valoración presencial o remota y estructuración de dictámenes de PCLO e Informes Periciales.
              </p>
            </div>

            {/* Admisiones */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unidad de Admisiones
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Auxiliares de admisiones orientadas a la captación, recepción de antecedentes clínicas, apertura de expediente y acompañamiento permanente al cliente.
              </p>
            </div>

            {/* Soporte Jurídico */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Soporte Jurídico Complementario
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Si el cliente no cuenta con abogado representante, ofrecemos orientación e información sobre alternativas de acompañamiento jurídico una vez emitido el dictamen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ¿Desea solicitar una valoración?
          </h2>
          <p className="mt-4 text-gray-600">
            Comuníquese con nuestra unidad de admisiones o solicite su cita de valoración directamente a través del portal.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/citas">
              <Button size="lg">
                Agendar valoración <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
