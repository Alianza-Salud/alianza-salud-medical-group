import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { submitAppointment } from '../../services/appointmentService';
import { getActiveServices } from '../../data/services';
import { timeSlots } from '../../data/site';

/**
 * Schema de validación para el formulario de cita.
 */
const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .email('Ingrese un correo electrónico válido'),
  phone: z
    .string()
    .min(7, 'Ingrese un número de teléfono válido')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  serviceType: z
    .string()
    .min(1, 'Seleccione un tipo de servicio'),
  preferredDate: z
    .string()
    .min(1, 'Seleccione una fecha'),
  preferredTime: z
    .string()
    .min(1, 'Seleccione un horario'),
  message: z
    .string()
    .max(2000, 'El mensaje no puede exceder 2000 caracteres')
    .optional()
    .or(z.literal('')),
  acceptedPolicy: z
    .boolean()
    .refine((val) => val === true, 'Debe aceptar la política para continuar'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

/**
 * Formulario de solicitud/programación de citas.
 * En Fase 1 usa datos mock. En fases futuras consumirá:
 *   GET /api/appointments/availability
 *   POST /api/appointments
 */
export function AppointmentForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const services = getActiveServices();

  // Fecha mínima: mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      acceptedPolicy: false,
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      setSubmitStatus(null);
      const result = await submitAppointment({
        ...data,
        message: data.message || '',
        acceptedPolicy: data.acceptedPolicy,
      });
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Ocurrió un error al enviar la solicitud. Intente nuevamente.',
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Ocurrió un error inesperado. Intente nuevamente.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitStatus && (
        <Alert
          variant={submitStatus.type}
          message={submitStatus.message}
          dismissible
        />
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="appt-fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          id="appt-fullName"
          type="text"
          autoComplete="name"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Su nombre completo"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email y teléfono */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appt-email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico *
          </label>
          <input
            id="appt-email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            placeholder="correo@ejemplo.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="appt-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            id="appt-phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            placeholder="+57 XXX XXX XXXX"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Tipo de servicio */}
      <div>
        <label htmlFor="appt-serviceType" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de servicio/caso *
        </label>
        <select
          id="appt-serviceType"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 bg-white"
          {...register('serviceType')}
        >
          <option value="">Seleccione un servicio</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
        )}
      </div>

      {/* Fecha y hora */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appt-date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha preferida *
          </label>
          <input
            id="appt-date"
            type="date"
            min={minDate}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            {...register('preferredDate')}
          />
          {errors.preferredDate && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="appt-time" className="block text-sm font-medium text-gray-700 mb-1">
            Horario preferido *
          </label>
          <select
            id="appt-time"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 bg-white"
            {...register('preferredTime')}
          >
            <option value="">Seleccione un horario</option>
            {timeSlots
              .filter((slot) => slot.available)
              .map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
          </select>
          {errors.preferredTime && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredTime.message}</p>
          )}
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="appt-message" className="block text-sm font-medium text-gray-700 mb-1">
          Motivo de consulta (opcional)
        </label>
        <textarea
          id="appt-message"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 resize-y"
          placeholder="Describa brevemente el motivo de su consulta"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Aceptación de política */}
      <div className="flex items-start gap-3">
        <input
          id="appt-policy"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register('acceptedPolicy')}
        />
        <label htmlFor="appt-policy" className="text-sm text-gray-600">
          Acepto que mis datos sean utilizados para gestionar mi solicitud de
          cita. La política de tratamiento de datos será definida próximamente. *
        </label>
      </div>
      {errors.acceptedPolicy && (
        <p className="text-sm text-red-600">{errors.acceptedPolicy.message}</p>
      )}

      {/* Botón de envío */}
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        <CalendarCheck className="h-4 w-4" />
        Solicitar cita
      </Button>
    </form>
  );
}
