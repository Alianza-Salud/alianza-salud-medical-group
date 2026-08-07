import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';

/**
 * Página placeholder de login.
 * Ruta: /login
 *
 * NO implementa autenticación real.
 * En fases futuras se desarrollará el sistema de login con JWT.
 */
export default function LoginPage() {
  usePageMeta(
    'Iniciar Sesión',
    'Acceso al área de clientes de Alianza Salud Medical Group — Disponible próximamente.'
  );

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-10 w-10 text-gray-400" />
        </div>

        <h1 className="mt-8 text-2xl font-bold text-gray-900">
          Acceso próximamente
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          El área de clientes estará disponible en una próxima versión de la
          plataforma. Podrá acceder al seguimiento de su caso, documentos y
          comunicaciones con el equipo.
        </p>

        <div className="mt-8 space-y-3">
          <Link to="/">
            <Button fullWidth>
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <Link to="/contacto">
            <Button variant="outline" fullWidth>
              Contactar para más información
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Si tiene preguntas sobre el acceso a la plataforma, contáctenos a
          través del formulario de contacto.
        </p>
      </div>
    </section>
  );
}
