import type { Service } from '../types/service';
import { services, getServiceBySlug, getActiveServices } from '../data/services';
// import { apiClient } from './api'; // Descomentar en fases futuras

/**
 * Capa de servicio para servicios jurídicos.
 *
 * Fase 1: Devuelve datos mock.
 * Fases futuras: Realizará peticiones HTTP al backend.
 *   - GET /api/services
 *   - GET /api/services/:slug
 */

/**
 * Obtiene todos los servicios activos.
 *
 * Futuro: const { data } = await apiClient.get<Service[]>('/services');
 */
export async function fetchServices(): Promise<Service[]> {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getActiveServices();
}

/**
 * Obtiene un servicio por su slug.
 *
 * Futuro: const { data } = await apiClient.get<Service>(`/services/${slug}`);
 */
export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getServiceBySlug(slug) ?? null;
}

/**
 * Obtiene todos los servicios (sin filtrar por estado).
 */
export async function fetchAllServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...services];
}
