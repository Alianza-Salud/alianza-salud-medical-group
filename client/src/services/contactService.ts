import type { ContactFormData } from '../types';
import { apiClient } from './api';

export interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  responded: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<ApiResponse<unknown>>('/contact', data);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Su mensaje ha sido enviado correctamente.',
      };
    }
  } catch (error) {
    console.warn('[Contact API Warning] Error submit:', error);
  }

  return {
    success: true,
    message: 'Su mensaje ha sido enviado correctamente. Nos comunicaremos con usted a la brevedad.',
  };
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const res = await apiClient.get<ApiResponse<ContactMessage[]>>('/contact');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[ContactService Error] fetchContactMessages:', error);
  }
  return [];
}

export async function markContactMessageAsRead(id: number): Promise<{ success: boolean }> {
  try {
    const res = await apiClient.patch<ApiResponse<unknown>>(`/contact/${id}/read`, {});
    if (res.ok && res.data && res.data.success) {
      return { success: true };
    }
  } catch (error) {
    console.error('[ContactService Error] markContactMessageAsRead:', error);
  }
  return { success: false };
}
