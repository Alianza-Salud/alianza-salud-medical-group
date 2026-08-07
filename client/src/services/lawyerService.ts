import type { Lawyer, CreateLawyerFormData } from '../types/lawyer';
import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchLawyers(): Promise<Lawyer[]> {
  try {
    const res = await apiClient.get<ApiResponse<Lawyer[]>>('/lawyers');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[LawyerService Error] fetchLawyers:', error);
  }
  return [];
}

export async function createLawyer(data: CreateLawyerFormData): Promise<{ success: boolean; message?: string; data?: Lawyer }> {
  try {
    const res = await apiClient.post<ApiResponse<Lawyer>>('/lawyers', data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[LawyerService Error] createLawyer:', error);
  }
  return { success: false, message: 'Error al registrar profesional.' };
}

export async function updateLawyer(id: number, data: Partial<Lawyer>): Promise<{ success: boolean; message?: string; data?: Lawyer }> {
  try {
    const res = await apiClient.put<ApiResponse<Lawyer>>(`/lawyers/${id}`, data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[LawyerService Error] updateLawyer:', error);
  }
  return { success: false, message: 'Error al actualizar profesional.' };
}
