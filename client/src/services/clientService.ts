import type { Client, CreateClientFormData } from '../types/client';
import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchClients(): Promise<Client[]> {
  try {
    const res = await apiClient.get<ApiResponse<Client[]>>('/clients');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[ClientService Error] fetchClients:', error);
  }
  return [];
}

export async function createClient(data: CreateClientFormData): Promise<{ success: boolean; message?: string; data?: Client }> {
  try {
    const res = await apiClient.post<ApiResponse<Client>>('/clients', data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[ClientService Error] createClient:', error);
  }
  return { success: false, message: 'Error al registrar cliente.' };
}

export async function updateClient(id: number, data: CreateClientFormData): Promise<{ success: boolean; message?: string; data?: Client }> {
  try {
    const res = await apiClient.put<ApiResponse<Client>>(`/clients/${id}`, data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[ClientService Error] updateClient:', error);
  }
  return { success: false, message: 'Error al actualizar cliente.' };
}
