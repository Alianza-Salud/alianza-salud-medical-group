import { apiClient } from './api';

export interface CaseReviewPetition {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  caseType: string;
  description: string;
  documents: Array<{
    name: string;
    storageKey?: string;
    filePath?: string;
    mimeType?: string;
    size?: number;
  }>;
  status: 'pending' | 'in_review' | 'contacted' | 'converted' | 'discarded';
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function submitCaseReviewPetition(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.upload<ApiResponse<unknown>>('/case-reviews', formData);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
    if (res.data && (res.data as any).error) {
      return { success: false, message: (res.data as any).error.message };
    }
  } catch (error: any) {
    console.error('[caseReviewService Error] submitCaseReviewPetition:', error);
  }
  return { success: false, message: 'Error al conectar con el servidor para enviar la solicitud.' };
}

export async function fetchCaseReviewPetitions(statusFilter: string = 'all'): Promise<CaseReviewPetition[]> {
  try {
    const res = await apiClient.get<ApiResponse<CaseReviewPetition[]>>(`/case-reviews${statusFilter && statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`);
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[caseReviewService Error] fetchCaseReviewPetitions:', error);
  }
  return [];
}

export async function updatePetitionStatus(
  id: number,
  status: string,
  adminNotes?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.patch<ApiResponse<unknown>>(`/case-reviews/${id}/status`, { status, adminNotes });
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (error) {
    console.error('[caseReviewService Error] updatePetitionStatus:', error);
  }
  return { success: false, message: 'Error al actualizar el estado de la solicitud.' };
}

export async function convertPetitionToCase(
  id: number,
  payload?: {
    clientId?: number;
    clientData?: { fullName: string; email: string; phone: string; documentId?: string; address?: string };
  }
): Promise<{ success: boolean; message?: string; caseId?: number }> {
  try {
    const res = await apiClient.post<ApiResponse<{ caseId: number }>>(`/case-reviews/${id}/convert`, payload || {});
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message,
        caseId: res.data.data.caseId,
      };
    }
  } catch (error) {
    console.error('[caseReviewService Error] convertPetitionToCase:', error);
  }
  return { success: false, message: 'Error al convertir la solicitud en expediente de caso.' };
}

export async function downloadPetitionDocument(petitionId: number, docIndex: number, filename: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${API_BASE_URL}/case-reviews/${petitionId}/documents/${docIndex}/download`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      console.error('[downloadPetitionDocument Error] HTTP status:', response.status);
      return false;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'documento.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    return true;
  } catch (error) {
    console.error('[caseReviewService Error] downloadPetitionDocument:', error);
    return false;
  }
}
