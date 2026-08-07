import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Wrapper de rutas protegidas para React Router.
 * Redirige a /login si no está autenticado, o a / si no tiene el rol requerido.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Verificando sesión..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
