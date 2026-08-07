import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z
      .string()
      .email('Ingrese un correo electrónico válido'),
    phone: z
      .string()
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'Confirme su contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  usePageMeta('Registro de Usuario', 'Cree una cuenta en Alianza Salud Medical Group.');
  const { register: registerAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  if (isAuthenticated) {
    navigate('/');
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    const result = await registerAuth({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
    });
    if (result.success) {
      navigate('/');
    } else {
      setErrorMessage(result.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="mt-2 text-sm text-gray-600">
              Regístrese para acceder al seguimiento de sus consultas
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6">
              <Alert variant="error" message={errorMessage} dismissible />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                id="reg-fullName"
                type="text"
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Juan Pérez"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico *
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono (opcional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+57 300 123 4567"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña *
              </label>
              <input
                id="reg-confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting} fullWidth className="mt-6">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </Button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tiene una cuenta?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
