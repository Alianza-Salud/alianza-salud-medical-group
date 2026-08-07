import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { siteInfo } from '../../data/site';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

/**
 * Header/navbar del sitio público.
 * Responsive con menú móvil hamburger.
 * Incluye botón de login preparado para fases futuras.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Nombre */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
            aria-label="Ir al inicio"
          >
            <span className="text-primary">{siteInfo.name}</span>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {siteInfo.navigation.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                  isActive(link.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-1">
              {siteInfo.navigation.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'rounded-md px-4 py-3 text-base font-medium transition-colors duration-200',
                    isActive(link.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" fullWidth>
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
