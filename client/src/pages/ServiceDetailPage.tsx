import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { getIconByName } from '../lib/icons';
import { usePageMeta } from '../hooks/usePageMeta';
import { getServiceBySlug } from '../data/services';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

/**
 * Página de detalle de servicio.
 * Ruta: /servicios/:slug
 *
 * En fases futuras, los datos vendrán del backend:
 * GET /api/services/:slug
 */
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  usePageMeta(
    service?.name || 'Servicio no encontrado',
    service?.shortDescription || 'Detalle de servicio jurídico de Alianza Salud Medical Group.'
  );

  if (!service) {
    return (
      <div className="py-20">
        <EmptyState
          title="Servicio no encontrado"
          description="El servicio que busca no está disponible. Puede consultar nuestros servicios disponibles."
          action={
            <Link to="/servicios">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Ver todos los servicios
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const IconComponent = getIconByName(service.icon);

  return (
    <>
      {/* Header del servicio */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Navegación de migas de pan">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/servicios" className="hover:text-primary transition-colors">
                  Servicios
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{service.name}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {service.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-3xl">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-12">
              {/* Situaciones */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Situaciones que puede abarcar
                </h2>
                <ul className="mt-6 space-y-3">
                  {service.situations.map((situation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-gray-700">{situation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proceso de atención */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Proceso de atención
                </h2>
                <ol className="mt-6 space-y-4">
                  {service.processSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar CTAs */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Necesita orientación?
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Si su situación se relaciona con alguno de estos escenarios,
                    no dude en contactarnos para una evaluación inicial.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Link to="/citas" className="block">
                      <Button fullWidth>
                        Solicitar asesoría
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/contacto" className="block">
                      <Button variant="outline" fullWidth>
                        Contactar
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Nota legal */}
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Esta información es de carácter orientativo y no constituye
                    asesoramiento legal. La viabilidad de cada caso depende de
                    sus circunstancias particulares y debe ser evaluada
                    individualmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
