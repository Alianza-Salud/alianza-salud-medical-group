import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, LogIn, ShieldCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const registerSchema = z
  .object({
    verificationCode: z
      .string()
      .trim()
      .length(8, 'El Código de Verificación debe tener exactamente 8 caracteres alfanuméricos')
      .transform((val) => val.toUpperCase()),
    email: z
      .string()
      .email('Ingrese un correo electrónico válido'),
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
  usePageMeta(
    'Registro de Cliente',
    'Active su cuenta de cliente en Alianza Salud Medical Group usando su Código de Verificación de 8 caracteres.'
  );
  const { user, register: registerAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'lawyer' || user.role === 'auxiliar_admisiones') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/dashboard/cliente', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    const result = await registerAuth({
      verificationCode: data.verificationCode,
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      navigate('/dashboard/cliente', { replace: true });
    } else {
      setErrorMessage(
        result.message || 'Error al registrar la cuenta. Verifique su Código de Verificación.'
      );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Registro de Cliente</h1>
            <p className="mt-2 text-sm text-gray-600">
              Active su usuario con el Código de Verificación de 8 caracteres entregado por su asesor o abogado.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6">
              <Alert variant="error" message={errorMessage} dismissible />
            </div>
          )}

          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-800 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
            <span>
              Los datos personales y del caso son registrados por la Administración. Para activar su acceso solo requiere su código de 8 caracteres y crear una contraseña.
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Código de verificación (8 caracteres) */}
            <div>
              <label htmlFor="reg-verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Verificación (8 caracteres) *
              </label>
              <input
                id="reg-verificationCode"
                type="text"
                maxLength={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono tracking-wider uppercase transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="EJ: AS8K9X2M"
                {...register('verificationCode')}
              />
              {errors.verificationCode && (
                <p className="mt-1 text-sm text-red-600">{errors.verificationCode.message}</p>
              )}
            </div>

            {/* Email / Nombre de Usuario */}
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

            {/* Contraseña */}
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

            {/* Confirmar contraseña */}
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
              <ShieldCheck className="h-4 w-4" />
              Activar Cuenta de Cliente
            </Button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya activó su cuenta?{' '}
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
