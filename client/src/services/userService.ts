import type { User } from '../types/auth';
import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await apiClient.get<ApiResponse<User[]>>('/users');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[UserService Error] fetchUsers:', error);
  }
  return [];
}

export async function updateUser(id: number, data: Partial<User>): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.put<ApiResponse<unknown>>(`/users/${id}`, data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (error) {
    console.error('[UserService Error] updateUser:', error);
  }
  return { success: false, message: 'Error al actualizar usuario.' };
}

export async function resetUserPassword(id: number, newPassword?: string): Promise<{ success: boolean; message?: string; temporaryPassword?: string }> {
  try {
    const res = await apiClient.post<ApiResponse<{ userId: number; temporaryPassword: string }>>(`/users/${id}/reset-password`, { newPassword });
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message,
        temporaryPassword: res.data.data.temporaryPassword,
      };
    }
  } catch (error) {
    console.error('[UserService Error] resetUserPassword:', error);
  }
  return { success: false, message: 'Error al restablecer la contraseña.' };
}
