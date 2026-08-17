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

const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Ingrese un correo electrónico válido'),
  phone: z
    .string()
    .min(7, 'Ingrese un número de teléfono válido')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  serviceType: z.string().min(1, 'Seleccione un servicio médico-pericial'),
  caseType: z.string().min(1, 'Seleccione el origen del caso/lesión'),
  preferredDate: z.string().min(1, 'Seleccione una fecha'),
  preferredTime: z.string().min(1, 'Seleccione un horario'),
  hasLawyer: z.enum(['si', 'no', 'no_especificado']).optional(),
  wantsLegalSupport: z.enum(['si', 'no', 'no_especificado']).optional(),
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

export function AppointmentForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const services = getActiveServices();

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
      hasLawyer: 'no',
      wantsLegalSupport: 'no_especificado',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      setSubmitStatus(null);
      const result = await submitAppointment({
        ...data,
        caseType: data.caseType,
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
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="+57 300 123 4567"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Tipo de servicio y Origen de Caso */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appt-serviceType" className="block text-sm font-medium text-gray-700 mb-1">
            Servicio médico-pericial *
          </label>
          <select
            id="appt-serviceType"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
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

        <div>
          <label htmlFor="appt-caseType" className="block text-sm font-medium text-gray-700 mb-1">
            Origen de la lesión / caso *
          </label>
          <select
            id="appt-caseType"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            {...register('caseType')}
          >
            <option value="">Seleccione origen del caso</option>
            <option value="accidente-transito">Accidente de tránsito</option>
            <option value="accidente-laboral">Accidente laboral</option>
            <option value="negligencia-medica">Negligencia y responsabilidad médica</option>
            <option value="otro">Otro</option>
          </select>
          {errors.caseType && (
            <p className="mt-1 text-sm text-red-600">{errors.caseType.message}</p>
          )}
        </div>
      </div>

      {/* Información de abogado y soporte jurídico */}
      <div className="grid gap-5 sm:grid-cols-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label htmlFor="appt-hasLawyer" className="block text-xs font-semibold text-gray-700 mb-1">
            ¿Ya cuenta con abogado representante?
          </label>
          <select
            id="appt-hasLawyer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none bg-white"
            {...register('hasLawyer')}
          >
            <option value="no">No cuento con abogado</option>
            <option value="si">Sí, ya tengo abogado</option>
            <option value="no_especificado">Prefiero no especificar</option>
          </select>
        </div>

        <div>
          <label htmlFor="appt-wantsLegalSupport" className="block text-xs font-semibold text-gray-700 mb-1">
            ¿Desea información sobre acompañamiento jurídico complementario?
          </label>
          <select
            id="appt-wantsLegalSupport"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none bg-white"
            {...register('wantsLegalSupport')}
          >
            <option value="si">Sí, deseo recibir información</option>
            <option value="no">No, solo requiero el dictamen médico</option>
            <option value="no_especificado">Evaluar más adelante</option>
          </select>
        </div>
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
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
          Descripción o motivo de la valoración (opcional)
        </label>
        <textarea
          id="appt-message"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          placeholder="Describa brevemente la lesión o el estado del proceso..."
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
          Acepto el tratamiento de mis datos personales para la programación de la valoración médico-pericial. *
        </label>
      </div>
      {errors.acceptedPolicy && (
        <p className="text-sm text-red-600">{errors.acceptedPolicy.message}</p>
      )}

      {/* Botón de envío */}
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        <CalendarCheck className="h-4 w-4" />
        Solicitar valoración médica
      </Button>
    </form>
  );
}
