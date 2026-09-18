import type { LegalCase, CreateCaseFormData, AddUpdateFormData, CaseUpdate, CaseDocument, AddDocumentFormData } from '../types/case';
import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchCases(): Promise<LegalCase[]> {
  try {
    const res = await apiClient.get<ApiResponse<LegalCase[]>>('/cases');
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[CaseService Error] fetchCases:', error);
  }
  return [];
}

export async function fetchCaseById(id: number): Promise<LegalCase | null> {
  try {
    const res = await apiClient.get<ApiResponse<LegalCase>>(`/cases/${id}`);
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[CaseService Error] fetchCaseById:', error);
  }
  return null;
}

export async function createCase(data: CreateCaseFormData): Promise<{ success: boolean; message?: string; data?: LegalCase }> {
  try {
    const res = await apiClient.post<ApiResponse<LegalCase>>('/cases', data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseService Error] createCase:', error);
  }
  return { success: false, message: 'Error al registrar el caso.' };
}

export async function updateCaseStage(caseId: number, stageName: string, status?: string): Promise<{ success: boolean; message?: string; data?: LegalCase }> {
  try {
    const res = await apiClient.patch<ApiResponse<LegalCase>>(`/cases/${caseId}/stage`, { stageName, status });
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseService Error] updateCaseStage:', error);
  }
  return { success: false, message: 'Error al actualizar etapa del caso.' };
}

export async function addCaseUpdate(caseId: number, data: AddUpdateFormData): Promise<{ success: boolean; message?: string; data?: CaseUpdate }> {
  try {
    const res = await apiClient.post<ApiResponse<CaseUpdate>>(`/cases/${caseId}/updates`, data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseService Error] addCaseUpdate:', error);
  }
  return { success: false, message: 'Error al registrar la novedad.' };
}

export async function addCaseDocument(caseId: number, data: AddDocumentFormData): Promise<{ success: boolean; message?: string; data?: CaseDocument | CaseDocument[] }> {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.type) formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    formData.append('visibleToClient', String(data.visibleToClient));

    if (data.files && data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append('files', data.files[i]);
      }
    } else if (data.file) {
      formData.append('file', data.file);
    }

    const res = await apiClient.upload<ApiResponse<CaseDocument | CaseDocument[]>>(`/cases/${caseId}/documents`, formData);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseService Error] addCaseDocument:', error);
  }
  return { success: false, message: 'Error al adjuntar los documentos.' };
}

export async function updateCaseLawyers(caseId: number, lawyerIds: number[]): Promise<{ success: boolean; message?: string; data?: LegalCase }> {
  try {
    const res = await apiClient.put<ApiResponse<LegalCase>>(`/cases/${caseId}/lawyers`, { lawyerIds });
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseService Error] updateCaseLawyers:', error);
  }
  return { success: false, message: 'Error al actualizar especialistas asignados.' };
}

export async function toggleDocumentVisibility(docId: number, visibleToClient: boolean): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.patch<ApiResponse<{ id: number; visibleToClient: boolean }>>(`/cases/documents/${docId}/visibility`, { visibleToClient });
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (error) {
    console.error('[CaseService Error] toggleDocumentVisibility:', error);
  }
  return { success: false, message: 'Error al cambiar la visibilidad del documento.' };
}

export async function downloadDocument(caseId: number, docId: number, filename: string): Promise<boolean> {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}/documents/${docId}/download`, {
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('[downloadDocument Error] HTTP status:', response.status);
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
    console.error('[CaseService Error] downloadDocument:', error);
    return false;
  }
}
