import type { CaseType, CreateCaseTypeFormData, UpdateCaseTypeFormData } from '../types/caseType';
import { apiClient } from './api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetchCaseTypes(includeInactive = false): Promise<CaseType[]> {
  try {
    const query = includeInactive ? '?all=true' : '';
    const res = await apiClient.get<ApiResponse<CaseType[]>>(`/case-types${query}`);
    if (res.ok && res.data && res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    console.error('[CaseTypeService Error] fetchCaseTypes:', error);
  }
  return [];
}

export async function createCaseType(data: CreateCaseTypeFormData): Promise<{ success: boolean; message?: string; data?: CaseType }> {
  try {
    const res = await apiClient.post<ApiResponse<CaseType>>('/case-types', data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseTypeService Error] createCaseType:', error);
  }
  return { success: false, message: 'Error al crear tipo de caso.' };
}

export async function updateCaseType(id: number, data: UpdateCaseTypeFormData): Promise<{ success: boolean; message?: string; data?: CaseType }> {
  try {
    const res = await apiClient.put<ApiResponse<CaseType>>(`/case-types/${id}`, data);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message, data: res.data.data };
    }
  } catch (error) {
    console.error('[CaseTypeService Error] updateCaseType:', error);
  }
  return { success: false, message: 'Error al actualizar tipo de caso.' };
}

export async function deleteCaseType(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiClient.delete<ApiResponse<null>>(`/case-types/${id}`);
    if (res.ok && res.data && res.data.success) {
      return { success: true, message: res.data.message };
    }
  } catch (error) {
    console.error('[CaseTypeService Error] deleteCaseType:', error);
  }
  return { success: false, message: 'Error al eliminar tipo de caso.' };
}
