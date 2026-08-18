import { apiClient } from './api';

export interface SiteInfoData {
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  schedule: string;
  history: string;
  mission: string;
  vision: string;
  values: string[];
  visual_resource: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const defaultInfo: SiteInfoData = {
  company_name: 'Alianza Salud Medical Group',
  tagline: 'Acompañamiento jurídico especializado con respaldo médico integral',
  phone: '+57 (601) 555-0199',
  email: 'contacto@alianzasalud.com',
  address: 'Carrera 15 # 93-47, Oficina 502, Bogotá D.C.',
  schedule: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM',
  history: 'Espacio reservado para información institucional adicional: historia, misión, visión, valores. — Pendiente de datos proporcionados por la empresa.',
  mission: 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.',
  vision: 'Ser la organización líder en Colombia en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.',
  values: ['Ética profesional', 'Excelencia técnica', 'Empatía con las víctimas', 'Transparencia', 'Rigor científico'],
  visual_resource: 'Espacio reservado para imagen o recurso visual institucional',
};

export async function fetchSiteInfo(): Promise<SiteInfoData> {
  try {
    const res = await apiClient.get<ApiResponse<SiteInfoData>>('/site-info');
    if (res.ok && res.data && res.data.success && res.data.data) {
      return { ...defaultInfo, ...res.data.data };
    }
  } catch (error) {
    console.warn('[siteInfoService Warning] Error fetching site-info:', error);
  }
  return defaultInfo;
}

export async function updateSiteInfo(
  data: Partial<SiteInfoData>
): Promise<{ success: boolean; message?: string; data?: SiteInfoData }> {
  try {
    const res = await apiClient.put<ApiResponse<SiteInfoData>>('/site-info', data);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Configuración guardada exitosamente.',
        data: res.data.data,
      };
    }
  } catch (error) {
    console.error('[siteInfoService Error] updateSiteInfo:', error);
  }
  return { success: false, message: 'Error al guardar la configuración del sitio.' };
}

export async function uploadVisualResourceImage(
  file: File
): Promise<{ success: boolean; message?: string; data?: { imageUrl: string; siteInfo: SiteInfoData } }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await apiClient.upload<ApiResponse<{ imageUrl: string; siteInfo: SiteInfoData }>>('/site-info/upload-visual-resource', formData);
    if (res.ok && res.data && res.data.success) {
      return {
        success: true,
        message: res.data.message || 'Imagen subida exitosamente.',
        data: res.data.data,
      };
    }
  } catch (error) {
    console.error('[siteInfoService Error] uploadVisualResourceImage:', error);
  }
  return { success: false, message: 'Error al subir la imagen del recurso visual.' };
}
