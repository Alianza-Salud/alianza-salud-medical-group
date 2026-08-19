import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { siteInfo } from '../../data/site';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenModal?: () => void;
}

/**
 * Header/navbar dinámico y elegante del sitio público.
 * Adapta su altura, fondo translúcido y sombra sutil al hacer scroll.
 */
export function Header({ onOpenModal }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const dashboardTarget = user?.role === 'admin' || user?.role === 'lawyer' || user?.role === 'auxiliar_admisiones' ? '/dashboard' : '/dashboard/cliente';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/92 backdrop-blur-md border-b border-gray-200/90 shadow-md h-16'
          : 'bg-gradient-to-b from-white via-white/95 to-white/90 backdrop-blur-xs border-b border-gray-100/80 h-20'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full" aria-label="Navegación principal">
        <div className="flex h-full items-center justify-between gap-2">
          
          {/* Logo & Marca con Distintivo Animado */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-primary shrink-0 group transition-transform duration-300 hover:scale-[1.01]"
            aria-label="Ir al inicio"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-slate-900 text-emerald-400 shadow-sm group-hover:shadow-md transition-shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-primary tracking-tight font-extrabold leading-none text-base sm:text-lg">
                {siteInfo.name}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase mt-0.5">
                Injury Management
              </span>
            </div>
          </Link>

          {/* Navegación Desktop con Indicadores de Enlace */}
          <div className="hidden lg:flex lg:items-center lg:gap-1.5 bg-gray-100/60 p-1.5 rounded-2xl border border-gray-200/60">
            {siteInfo.navigation.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'relative rounded-xl px-4 py-2 text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5',
                    active
                      ? 'text-primary bg-white shadow-xs font-black'
                      : 'text-gray-600 hover:text-primary hover:bg-white/60 font-semibold'
                  )}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Acciones de Usuario Autenticado o Invitado */}
          <div className="hidden lg:flex lg:items-center lg:gap-2.5">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link to={dashboardTarget}>
                  <Button variant="primary" size="sm" className="font-bold shadow-xs">
                    <LayoutDashboard className="h-4 w-4" />
                    Ir al Panel
                  </Button>
                </Link>
                <div className="flex items-center gap-2 rounded-full bg-gray-100/90 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 shadow-2xs">
                  <UserIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-bold">{user.fullName.split(' ')[0]}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} title="Cerrar Sesión">
                  <LogOut className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="font-bold border-gray-300 hover:border-primary">
                  <LogIn className="h-4 w-4 text-primary" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            className="lg:hidden rounded-xl p-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
          <div id="mobile-menu" className="lg:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col gap-1">
              {siteInfo.navigation.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'rounded-xl px-4 py-3 text-base font-bold transition-colors duration-200',
                    isActive(link.href)
                      ? 'text-primary bg-primary/8'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4 space-y-3">
                {isAuthenticated && user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-gray-800">{user.fullName}</span>
                    </div>
                    <Link to={dashboardTarget} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" fullWidth size="sm" className="font-bold">
                        <LayoutDashboard className="h-4 w-4" />
                        Ir al Panel
                      </Button>
                    </Link>
                    <Button variant="outline" fullWidth size="sm" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                      <LogOut className="h-4 w-4 text-red-600" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth size="sm" className="font-bold">
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
