import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Layout principal que envuelve todas las páginas públicas.
 * Incluye Header, Footer y scroll-to-top en cambio de ruta.
 */
export function PageLayout() {
  const { pathname } = useLocation();

  // Scroll to top cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
