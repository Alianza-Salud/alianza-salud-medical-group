import type { AppointmentFormData } from '../types/appointment';
import type { TimeSlot } from '../types/appointment';
import { timeSlots } from '../data/site';
// import { apiClient } from './api'; // Descomentar en fases futuras

/**
 * Capa de servicio para citas.
 *
 * Fase 1: Devuelve datos mock y simula envío.
 * Fases futuras:
 *   - GET /api/appointments/availability
 *   - POST /api/appointments
 */

/**
 * Obtiene las franjas horarias disponibles para una fecha.
 *
 * Futuro: const { data } = await apiClient.get<TimeSlot[]>(
 *   `/appointments/availability?date=${date}`
 * );
 */
export async function fetchAvailability(date: string): Promise<TimeSlot[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // En Fase 1, todas las franjas están disponibles
  // En fases futuras, la disponibilidad dependerá de la fecha y la agenda real
  console.log(`[Mock] Consultando disponibilidad para ${date}`);
  return [...timeSlots];
}

/**
 * Envía una solicitud de cita.
 *
 * Futuro: const { data } = await apiClient.post('/appointments', appointmentData);
 */
export async function submitAppointment(
  data: AppointmentFormData
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simular envío exitoso
  console.log('[Mock] Solicitud de cita enviada:', data);
  return {
    success: true,
    message:
      'Su solicitud de cita ha sido recibida. Nos comunicaremos con usted para confirmar la fecha y hora.',
  };
}
