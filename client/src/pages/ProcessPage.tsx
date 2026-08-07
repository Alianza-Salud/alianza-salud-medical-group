import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProcessTimeline } from '../components/process/ProcessTimeline';
import { Button } from '../components/ui/Button';

/**
 * Página del proceso de atención.
 * Ruta: /proceso
 *
 * NOTA: Este es un flujo conceptual para el sitio público.
 * No todos los casos siguen exactamente las mismas etapas.
 */
export default function ProcessPage() {
  usePageMeta(
    'Proceso de Atención',
    'Conozca el proceso de atención de Alianza Salud Medical Group: desde el primer contacto hasta la resolución de su caso.'
  );

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestro proceso de atención"
            subtitle="Le acompañamos paso a paso, desde el primer contacto hasta la resolución de su caso. Cada situación es única y el proceso se adapta según las necesidades particulares."
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ProcessTimeline />
        </div>
      </section>

      {/* Nota y CTA */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6 mb-8">
            <p className="text-sm text-blue-800 leading-relaxed">
              Este flujo es una representación general del proceso de atención.
              Las etapas específicas de cada caso dependen de su naturaleza y
              circunstancias particulares. Nuestro equipo le orientará sobre los
              pasos aplicables a su situación.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900">
            ¿Listo para dar el primer paso?
          </h3>
          <p className="mt-3 text-gray-600">
            Contáctenos para una evaluación inicial de su caso.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/citas">
              <Button size="lg">
                Agendar cita
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button variant="outline" size="lg">
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
