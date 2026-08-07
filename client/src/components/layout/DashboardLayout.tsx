import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FolderKanban,
  Users,
  UserCheck,
  ShieldCheck,
  CalendarDays,
  Mail,
  LogOut,
  Home,
  Menu,
  X,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { siteInfo } from '../../data/site';
import { cn } from '../../lib/utils';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Ítems principales de navegación según rol
  const mainNavItems =
    user?.role === 'admin'
      ? [
          {
            label: 'Casos Jurídicos',
            href: '/dashboard',
            icon: FolderKanban,
          },
          {
            label: 'Gestión de Citas',
            href: '/dashboard/citas',
            icon: CalendarDays,
          },
          {
            label: 'Mensajes de Contacto',
            href: '/dashboard/mensajes',
            icon: Mail,
          },
          {
            label: 'Maestro de Clientes',
            href: '/dashboard/clientes',
            icon: Users,
          },
          {
            label: 'Maestro de Abogados',
            href: '/dashboard/abogados',
            icon: UserCheck,
          },
          {
            label: 'Maestro de Usuarios',
            href: '/dashboard/usuarios',
            icon: ShieldCheck,
          },
          {
            label: 'Configuración Sitio',
            href: '/dashboard/configuracion',
            icon: Sliders,
          },
        ]
      : user?.role === 'lawyer'
      ? [
          {
            label: 'Casos Asignados',
            href: '/dashboard',
            icon: FolderKanban,
          },
          {
            label: 'Gestión de Citas',
            href: '/dashboard/citas',
            icon: CalendarDays,
          },
          {
            label: 'Mensajes de Contacto',
            href: '/dashboard/mensajes',
            icon: Mail,
          },
          {
            label: 'Maestro de Clientes',
            href: '/dashboard/clientes',
            icon: Users,
          },
        ]
      : [
          {
            label: 'Mis Casos',
            href: '/dashboard/cliente',
            icon: FolderKanban,
          },
        ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white shadow-sm">
        {/* Header del Sidebar */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            AS
          </div>
          <div>
            <span className="font-bold text-gray-900 text-sm block leading-tight">
              {siteInfo.name}
            </span>
            <span className="text-[11px] text-gray-500 block">
              Panel Administrativo
            </span>
          </div>
        </div>

        {/* Info del usuario logueado */}
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-900">
                {user?.fullName || 'Usuario'}
              </p>
              <p className="truncate text-[11px] text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                {user?.role === 'admin'
                  ? 'Administrador'
                  : user?.role === 'lawyer'
                  ? 'Abogado'
                  : 'Cliente'}
              </span>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones de pie de página */}
        <div className="border-t border-gray-200 p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4 text-gray-400" />
            Volver a la Web Pública
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile Toggle Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile Container */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out md:hidden flex flex-col',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <span className="font-bold text-gray-900 text-sm">Alianza Salud</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3 space-y-1">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4 text-gray-400" />
            Volver a la Web Pública
          </Link>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Superior Mobile */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-gray-900 text-sm">Alianza Salud</span>
          <div className="w-6" />
        </header>

        {/* Vista activa */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
