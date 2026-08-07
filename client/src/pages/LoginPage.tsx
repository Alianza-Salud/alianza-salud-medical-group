import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const loginSchema = z.object({
  email: z
    .string()
    .email('Ingrese un correo electrónico válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  usePageMeta('Iniciar Sesión', 'Acceda a su cuenta en Alianza Salud Medical Group.');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    navigate('/');
  }

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    const result = await login(data);
    if (result.success) {
      navigate('/');
    } else {
      setErrorMessage(result.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
            <p className="mt-2 text-sm text-gray-600">
              Ingrese sus credenciales para acceder a la plataforma
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6">
              <Alert variant="error" message={errorMessage} dismissible />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="correo@ejemplo.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-6">
              <LogIn className="h-4 w-4" />
              Ingresar
            </Button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tiene una cuenta?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Registrarse aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
