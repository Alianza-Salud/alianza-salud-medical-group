import type { ContactFormData } from '../types';
// import { apiClient } from './api'; // Descomentar en fases futuras

/**
 * Capa de servicio para contacto.
 *
 * Fase 1: Simula envío de formulario.
 * Fases futuras:
 *   - POST /api/contact
 */

/**
 * Envía un formulario de contacto.
 *
 * Futuro: const { data } = await apiClient.post('/contact', contactData);
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simular envío exitoso
  console.log('[Mock] Formulario de contacto enviado:', data);
  return {
    success: true,
    message:
      'Su mensaje ha sido enviado correctamente. Nos comunicaremos con usted a la brevedad.',
  };
}
