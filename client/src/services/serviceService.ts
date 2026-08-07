import type { Service } from '../types/service';
import { services as mockServices, getServiceBySlug as getMockServiceBySlug, getActiveServices as getMockActiveServices } from '../data/services';
import { apiClient } from './api';

/**
 * Capa de servicio para servicios jurídicos.
 *
 * Fase 2: Peticiones HTTP reales al backend Express:
 *   - GET /api/services
 *   - GET /api/services/:slug
 * Con fallback a los datos mock local si el backend no está disponible.
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Obtiene todos los servicios activos.
 */
export async function fetchServices(): Promise<Service[]> {
  try {
    const res = await apiClient.get<ApiResponse<Service[]>>('/services');
    if (res.ok && res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[Service API Warning] No se pudo conectar con el backend, usando fallback local:', error);
  }
  return getMockActiveServices();
}

/**
 * Obtiene un servicio por su slug.
 */
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await apiClient.get<ApiResponse<Service>>(`/services/${slug}`);
    if (res.ok && res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[Service API Warning] No se pudo conectar con el backend, usando fallback local:', error);
  }
  return getMockServiceBySlug(slug) ?? null;
}

/**
 * Obtiene todos los servicios (sin filtrar).
 */
export async function fetchAllServices(): Promise<Service[]> {
  try {
    const res = await apiClient.get<ApiResponse<Service[]>>('/services');
    if (res.ok && res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[Service API Warning] No se pudo conectar con el backend, usando fallback local:', error);
  }
  return [...mockServices];
}
