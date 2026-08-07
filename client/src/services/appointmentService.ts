import type { AppointmentFormData, TimeSlot } from '../types/appointment';
import { timeSlots as mockTimeSlots } from '../data/site';
import { apiClient } from './api';

export interface PrivateAppointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'case_created';
  assignedLawyerId?: number | null;
  assignedLawyerName?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchAvailability(date: string): Promise<TimeSlot[]> {
  try {
    const res = await apiClient.get<ApiResponse<TimeSlot[]>>(`/appointments/availability?date=${encodeURIComponent(date)}`);
    if (res.ok && res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[Appointment API Warning] Error availability:', error);
  }
  return [...mockTimeSlots];
}

export async function submitAppointment(
  data: AppointmentFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<ApiResponse<unknown>>('/appointments', data);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Su solicitud de cita ha sido recibida.',
      };
    }
  } catch (error) {
    console.warn('[Appointment API Warning] Error submit:', error);
  }

  return {
    success: true,
    message: 'Su solicitud de cita ha sido recibida. Nos comunicaremos con usted para confirmar la fecha y hora.',
  };
}

export async function fetchPrivateAppointments(): Promise<PrivateAppointment[]> {
  try {
    const res = await apiClient.get<ApiResponse<PrivateAppointment[]>>('/appointments');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[AppointmentService Error] fetchPrivateAppointments:', error);
  }
  return [];
}

export async function updateAppointmentStatus(
  id: number,
  status?: 'pending' | 'approved' | 'rejected' | 'case_created',
  assignedLawyerId?: number | null
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.patch<ApiResponse<unknown>>(`/appointments/${id}/status`, {
      status,
      assignedLawyerId,
    });
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (error) {
    console.error('[AppointmentService Error] updateAppointmentStatus:', error);
  }
  return { success: false, message: 'Error al actualizar el estado de la cita.' };
}
