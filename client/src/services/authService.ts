import type { LoginCredentials, RegisterFormData, AuthResponse, User } from '../types/auth';
import { apiClient } from './api';

/**
 * Servicio de Autenticación del Frontend.
 */

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  } catch (error) {
    console.error('[AuthService Error] loginUser:', error);
    return {
      success: false,
      error: { message: 'No se pudo conectar con el servidor de autenticación.', status: 500 },
    };
  }
}

export async function registerUser(data: RegisterFormData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  } catch (error) {
    console.error('[AuthService Error] registerUser:', error);
    return {
      success: false,
      error: { message: 'No se pudo conectar con el servidor de autenticación.', status: 500 },
    };
  }
}

export async function fetchCurrentUser(): Promise<{ success: boolean; data?: User }> {
  try {
    const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    if (res.ok && res.data.success) {
      return { success: true, data: res.data.data };
    }
  } catch (error) {
    console.error('[AuthService Error] fetchCurrentUser:', error);
  }
  return { success: false };
}
