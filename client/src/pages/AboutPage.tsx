import { Link } from 'react-router-dom';
import { ArrowRight, Shield, HeartPulse, Scale, Users } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { CTASection } from '../components/sections/CTASection';

/**
 * Página "Sobre nosotros".
 * Ruta: /nosotros
 *
 * NOTA: El contenido es placeholder. No se inventa información corporativa.
 * Debe ser reemplazado con la información real proporcionada por la empresa.
 */
export default function AboutPage() {
  usePageMeta(
    'Nosotros',
    'Conozca Alianza Salud Medical Group — Una organización que integra servicios jurídicos y especialidades en salud en Medellín, Colombia.'
  );

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sobre Alianza Salud Medical Group"
            subtitle="Una organización que integra servicios de consultoría jurídica y especialidades en salud para brindar un acompañamiento integral."
          />
        </div>
      </section>

      {/* Presentación */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Quiénes somos
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Alianza Salud Medical Group es una organización ubicada en
                Medellín, Colombia, que integra diferentes áreas de servicio,
                entre ellas una IPS / área de especialidades en salud y un área
                de consultoría jurídica.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Esta integración nos permite ofrecer un enfoque diferenciador en
                el acompañamiento de casos donde convergen aspectos legales y
                médicos, combinando el análisis jurídico con el respaldo de
                especialistas en salud.
              </p>
              {/* Placeholder para información institucional adicional */}
              <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                <p className="text-sm text-gray-500 italic">
                  [Espacio reservado para información institucional adicional:
                  historia, misión, visión, valores. — Pendiente de datos proporcionados por la empresa.]
                </p>
              </div>
            </div>

            {/* Placeholder visual */}
            <div className="rounded-xl bg-gray-100 p-12 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                [Espacio reservado para imagen o recurso visual institucional]
              </p>
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
                El área de consultoría jurídica atiende casos relacionados con
                negligencia médica, responsabilidad médica, accidentes de
                tránsito, indemnizaciones y otros casos jurídicos del ámbito
                médico y de responsabilidad.
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
                El área de especialidades en salud proporciona conceptos,
                valoraciones y dictámenes médicos especializados que pueden ser
                necesarios para el análisis de determinados casos jurídicos.
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
                La articulación entre ambas áreas permite un análisis más
                completo de cada caso, combinando la perspectiva jurídica con el
                conocimiento médico especializado para una evaluación integral.
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
            Si tiene alguna pregunta sobre nuestra organización o los servicios
            que ofrecemos, no dude en contactarnos.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/servicios">
              <Button>
                Ver servicios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button variant="outline">Contactar</Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
