/**
 * Representa una solicitud de cita.
 * En fases futuras, mapeará a la tabla `appointments` en MySQL.
 */
export interface Appointment {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  acceptedPolicy: boolean;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

/**
 * Datos del formulario de solicitud de cita (sin campos auto-generados).
 */
export type AppointmentFormData = Omit<Appointment, 'id' | 'status' | 'createdAt'>;

/**
 * Franja horaria disponible (mock para Fase 1, API en fases futuras).
 */
export interface TimeSlot {
  value: string;
  label: string;
  available: boolean;
}
