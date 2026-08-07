import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { submitContactForm } from '../../services/contactService';

/**
 * Schema de validación para el formulario de contacto.
 */
const contactSchema = z.object({
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
  subject: z
    .string()
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder 200 caracteres'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

/**
 * Formulario de contacto con validación.
 * En Fase 1 simula el envío. En fases futuras usará POST /api/contact.
 */
export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setSubmitStatus(null);
      const result = await submitContactForm(data);
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Ocurrió un error al enviar el mensaje. Intente nuevamente.',
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
        <label htmlFor="contact-fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          id="contact-fullName"
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
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico *
          </label>
          <input
            id="contact-email"
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
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            id="contact-phone"
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

      {/* Asunto */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
          Asunto *
        </label>
        <input
          id="contact-subject"
          type="text"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          placeholder="Motivo de su consulta"
          {...register('subject')}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 resize-y"
          placeholder="Describa brevemente su situación o consulta"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Botón de envío */}
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        <Send className="h-4 w-4" />
        Enviar mensaje
      </Button>
    </form>
  );
}
