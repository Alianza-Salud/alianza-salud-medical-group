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

export async function convertPetitionToCase(id: number): Promise<{ success: boolean; message?: string; caseId?: number }> {
  try {
    const res = await apiClient.post<ApiResponse<{ caseId: number }>>(`/case-reviews/${id}/convert`, {});
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
