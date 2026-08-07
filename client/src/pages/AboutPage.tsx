import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, HeartPulse, Scale, Users, Target, Eye, Award } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { fetchSiteInfo, type SiteInfoData } from '../services/siteInfoService';

export default function AboutPage() {
  usePageMeta(
    'Nosotros',
    'Conozca Alianza Salud Medical Group — Una organización que integra servicios jurídicos y especialidades en salud.'
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
            subtitle={siteInfo?.tagline || 'Una organización que integra servicios de consultoría jurídica y especialidades en salud para brindar un acompañamiento integral.'}
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
                {siteInfo?.company_name || 'Alianza Salud Medical Group'} es una organización que integra diferentes áreas de servicio, entre ellas un área de especialidades en salud e IPS y un área de consultoría jurídica.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Esta integración nos permite ofrecer un enfoque diferenciador en el acompañamiento de casos donde convergen aspectos legales y médicos, combinando el análisis jurídico con el respaldo de especialistas en salud.
              </p>
              
              {/* Espacio reservado / Información Institucional Adicional */}
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">
                <p className="text-sm text-gray-600 italic">
                  {siteInfo?.history || '[Espacio reservado para información institucional adicional: historia, misión, visión, valores. — Pendiente de datos proporcionados por la empresa.]'}
                </p>
              </div>
            </div>

            {/* Recurso visual institucional */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center shadow-sm">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-14 w-14" />
              </div>
              <p className="text-sm text-gray-600 font-semibold italic">
                {siteInfo?.visual_resource || '[Espacio reservado para imagen o recurso visual institucional]'}
              </p>
            </div>
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
                {siteInfo?.mission || 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.'}
              </p>
            </div>

            {/* Visión */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Visión</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {siteInfo?.vision || 'Ser la organización líder en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.'}
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
                  : ['Ética profesional', 'Excelencia técnica', 'Empatía con las víctimas', 'Transparencia', 'Rigor científico']
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

      {/* Áreas */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestras áreas"
            subtitle="La articulación entre el área jurídica y el área de especialidades en salud es lo que nos diferencia."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Área jurídica */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Consultoría Jurídica
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                El área de consultoría jurídica atiende casos relacionados con negligencia médica, responsabilidad médica, accidentes de tránsito, indemnizaciones y otros casos jurídicos del ámbito médico.
              </p>
            </div>

            {/* Área de salud */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Especialidades en Salud
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                El área de especialidades en salud proporciona conceptos, valoraciones y dictámenes médicos especializados que pueden ser necesarios para el análisis de determinados casos jurídicos.
              </p>
            </div>

            {/* Articulación */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Enfoque Integrado
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                La articulación entre ambas áreas permite un análisis más completo de cada caso, combinando la perspectiva jurídica con el conocimiento médico especializado para una evaluación integral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ¿Desea conocer más?
          </h2>
          <p className="mt-4 text-gray-600">
            Si tiene alguna pregunta sobre nuestra organización o los servicios que ofrecemos, no dude en comunicarse con nosotros.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/contacto">
              <Button size="lg">
                Contáctenos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
