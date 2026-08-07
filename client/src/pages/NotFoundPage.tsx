import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';

/**
 * Página 404 — No encontrada.
 */
export default function NotFoundPage() {
  usePageMeta('Página no encontrada');

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Página no encontrada
        </h1>
        <p className="mt-4 text-gray-600">
          La página que busca no existe o ha sido movida. Verifique la URL o
          regrese al inicio.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>
              <Home className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
