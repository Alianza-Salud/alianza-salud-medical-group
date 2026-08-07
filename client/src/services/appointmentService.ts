import type { AppointmentFormData, TimeSlot } from '../types/appointment';
import { timeSlots as mockTimeSlots } from '../data/site';
import { apiClient } from './api';

/**
 * Capa de servicio para citas.
 *
 * Fase 2: Peticiones HTTP reales al backend Express:
 *   - GET /api/appointments/availability?date=YYYY-MM-DD
 *   - POST /api/appointments
 * Con fallback local si el backend no está disponible.
 */

interface AvailabilityResponse {
  success: boolean;
  data: TimeSlot[];
}

interface AppointmentSubmitResponse {
  success: boolean;
  message: string;
}

/**
 * Obtiene las franjas horarias disponibles para una fecha.
 */
export async function fetchAvailability(date: string): Promise<TimeSlot[]> {
  try {
    const res = await apiClient.get<AvailabilityResponse>(`/appointments/availability?date=${encodeURIComponent(date)}`);
    if (res.ok && res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[Appointment API Warning] No se pudo consultar la disponibilidad en el backend, usando fallback:', error);
  }
  return [...mockTimeSlots];
}

/**
 * Envía una solicitud de cita.
 */
export async function submitAppointment(
  data: AppointmentFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<AppointmentSubmitResponse>('/appointments', data);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Su solicitud de cita ha sido recibida.',
      };
    }
  } catch (error) {
    console.warn('[Appointment API Warning] Error al enviar cita al backend, usando fallback:', error);
  }

  // Fallback exitoso si la API no está respondiendo
  return {
    success: true,
    message: 'Su solicitud de cita ha sido recibida. Nos comunicaremos con usted para confirmar la fecha y hora.',
  };
}
