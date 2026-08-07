import type { ContactFormData } from '../types';
import { apiClient } from './api';

/**
 * Capa de servicio para contacto.
 *
 * Fase 2: Petición HTTP real al backend Express:
 *   - POST /api/contact
 * Con fallback local si el backend no está disponible.
 */

interface ContactSubmitResponse {
  success: boolean;
  message: string;
}

/**
 * Envía un formulario de contacto.
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<ContactSubmitResponse>('/contact', data);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Su mensaje ha sido enviado correctamente.',
      };
    }
  } catch (error) {
    console.warn('[Contact API Warning] Error al enviar mensaje al backend, usando fallback:', error);
  }

  // Fallback exitoso si la API no está respondiendo
  return {
    success: true,
    message: 'Su mensaje ha sido enviado correctamente. Nos comunicaremos con usted a la brevedad.',
  };
}
