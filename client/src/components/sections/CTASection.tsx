import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Sección CTA de contacto para la página de inicio.
 */
export function CTASection() {
  return (
    <section className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          ¿Necesita asesoría jurídica?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Contáctenos para una evaluación inicial de su caso. Nuestro equipo
          interdisciplinario está preparado para orientarle.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/citas">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Agendar cita
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/contacto">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 hover:text-white"
            >
              <Phone className="h-5 w-5" />
              Contactar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
